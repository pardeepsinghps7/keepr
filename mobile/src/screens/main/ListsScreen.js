import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    ScrollView,
    Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import imagesPath from '../../constants/images';
import COLORS from '../../constants/colors';
import { ROUTES, STRINGS } from '../../constants/strings';
import { EditListModal, Header, Loader, NoInternetComponent, showCustomToast } from '../../index.js';
import ListPopupModal from '../../components/ListPopupModal.js';
import AddNewListModal from '../../components/AddNewListModal.js';
import actions from '../../redux/actions/index.js';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import validator from '../../utils/validators.js';

const ListsScreen = ({ navigation }) => {
    const { LABELS, MISC } = STRINGS
    const isFocused = useIsFocused();
    const [state, setState] = useState({
        dataList: [],
        itemModalVisible: false,
        addListModalVisible: false,
        editListModalVisible: false,
        loading: false,
        noInternet: false,
        selectedItem: {},
        categoriesList: [
            { id: '1', title: 'Restaurant', icon: imagesPath.restaurant },
            { id: '2', title: 'Wine', icon: imagesPath.wine },
            { id: '3', title: 'Bourbon', icon: imagesPath.bourbon },
            { id: '4', title: 'Movies', icon: imagesPath.movies },
            { id: '5', title: 'TV Shows', icon: imagesPath.tvShows },
            { id: '6', title: 'Podcasts', icon: imagesPath.podcasts },
        ]
    });

    const updateState = (data) => setState((prev) => ({ ...prev, ...data }));

    const {
        dataList,
        itemModalVisible,
        addListModalVisible,
        editListModalVisible,
        loading,
        noInternet,
        selectedItem,
        categoriesList,
    } = state;

    useEffect(() => {
        let isActive = true;

        if (isFocused) {
            init(isActive);
        }
        return () => {
            isActive = false;
        };
    }, [isFocused]);

    const init = async (isActive) => {
        updateState({ loading: true });
        try {
            const response = await actions.getUserListWithItemCount();
            console.log('List getUserListWithItemCount response', response);
            // if (isActive) {
            updateState({ dataList: response, noInternet: false });
            // }
        } catch (error) {
            // if (isActive) {
            if (error.code === 506) {
                updateState({ noInternet: true });
            }
            console.log('API failed:', error.message);
            showCustomToast(LABELS.error, error.message);
            // }
        } finally {
            // if (isActive) 
            updateState({ loading: false });
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(ROUTES.listDetailsScreen, { item })}>
            <View style={styles.cardItems}>
                <Image style={styles.iconImageStyle} source={{ uri: item.icon }} />
                <View style={{gap:2}}>
                    <Text style={styles.cardTitle}>{item.label}</Text>
                    <Text style={styles.itemCount}>{item.items_count || 0} Items</Text>
                </View>
            </View>
            {/* <TouchableOpacity onPress={() => updateState({ selectedItem: item, itemModalVisible: true })}> */}
                {/* <Icon name="ellipsis-vertical-sharp" size={20} color={COLORS.black} /> */}
                <MaterialIcons name="chevron-right" size={28} color={COLORS.black} />
            {/* </TouchableOpacity> */}
        </TouchableOpacity>
    );

    const onLeftIconTap = () => {
        console.log('helllll')
        navigation.goBack();
    }
    const handleAddPress = () => {
        console.log('Floating button pressed!');
        // Add your navigation or action here
        updateState({ addListModalVisible: true });
    };

    const deleteSelectedItem = async () => {
        updateState({ loading: true });
        try {
            const response = await actions.deleteList(selectedItem?.id);
            console.log('deleteList response:', response);
            const updatedList = dataList.filter((cat) => cat.id !== selectedItem.id);
            updateState({ itemModalVisible: false, selectedItem: {}, dataList: updatedList });
            showCustomToast(LABELS.success, MISC.listDeletedSuccessfully)
        } catch (error) {
            console.log('deleteList failed:', error.message);
            showCustomToast(LABELS.error, error.message);
        } finally {
            updateState({ loading: false });
        }

    };

    const handleSaveNewList = async (newItem) => {
        console.log('fdfdsfs', newItem)
        Keyboard.dismiss();
        const validation = validator.isValidData(
            {
                title: newItem?.label,
            }
        );
        console.log('validation', validation)
        if (!validation.valid) {
            showCustomToast(LABELS.error, validation.message);
            // console.error(validation.message)
            return;
        }
        updateState({ loading: true });
        try {
            const payload = {
                label: newItem?.label,
                icon: newItem?.icon,
            };
            const response = await actions.addList(payload);
            console.log('addList response:', response);
            // navigation.goBack();
            updateState({
                // dataList: [...dataList, newItem],
                addListModalVisible: false,
            });
            init();
            showCustomToast(LABELS.success, MISC.listAddedSuccessfully)
        } catch (error) {
            console.log('addItem failed:', error.message);
            showCustomToast(LABELS.error, error.message);
        } finally {
            updateState({ loading: false });
        }
    };

    // const handleView = (item) => {
    //     navigation.navigate(ROUTES.listDetailsScreen, { item });
    //     updateState({ itemModalVisible: false });
    // }
    const handleEdit = () => {
        updateState({ itemModalVisible: false, editListModalVisible: true });
    }

    const ListEmptyComponent = () => {
        return (
            <NoInternetComponent onPress={() => init()} />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Loader modalVisible={loading} />
            {/* Header */}
            <Header title={MISC.yourLists} onLeftIconTap={onLeftIconTap} />

            <FlatList
                data={dataList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={!loading && ListEmptyComponent}
                // numColumns={2}
                // columnWrapperStyle={styles.grid}
                contentContainerStyle={{ padding: 16, gap: 16, flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            />
            {dataList.length > 0 && <TouchableOpacity style={styles.fab} onPress={handleAddPress}>
                <Icon name="add" size={28} color={COLORS.black} />
            </TouchableOpacity>}

            {/* List Popup Modal */}
            <ListPopupModal
                selectedItem={selectedItem}
                modalVisible={itemModalVisible}
                setModalVisible={(val) => updateState({ itemModalVisible: val })}
                onEdit={handleEdit}
                onDelete={deleteSelectedItem}
            />

            {/* Add New List Popup Modal */}
            <AddNewListModal
                selectedItem={selectedItem}
                modalVisible={addListModalVisible}
                setModalVisible={(val) => updateState({ addListModalVisible: val })}
                onSave={handleSaveNewList}
            />
        </SafeAreaView>
    );
}

export default ListsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    viewContainer: {
        flex: 1,
        padding: 16
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        // width: '47%',
        height: 70,
        paddingVertical: 16,
        paddingLeft: 16,
        paddingRight: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 8,
        position: 'relative',

    },
    cardItems: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconImageStyle: {
        width: 28,
        height: 28,
        resizeMode: 'contain'
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '400',
        color: COLORS.text_secondary,
    },
    itemCount: {
        fontSize: 12,
        fontWeight: '400',
        color: COLORS.text_secondary,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: COLORS.primary, // or any color you want
        borderRadius: 28,
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // for Android shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    emptyContainer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
    noInternetImageStyle: {
        width: 40,
        height: 32,
        resizeMode: 'contain'
    },
    tryAgainContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    resendImageStyle: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
});
