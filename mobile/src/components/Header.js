//import liraries
import React, { Component, useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, Dimensions } from 'react-native';
import COLORS from '../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import imagesPath from '../constants/images';
import { ROUTES, STRINGS } from '../constants/strings';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { showCustomToast } from '../utils/helpers';
import CustomInput from './CustomInput';
import actions from '../redux/actions';

const SCREEN_WIDTH = Dimensions.get('screen').width;
// create a component
const Header = ({
    title,
    isBack = false,
    onRightPress,
    onMenuPress,
    customeRightIcon,
    rightText = '',
}) => {
    const { LABELS, MISC } = STRINGS
    const navigation = useNavigation();
    const userData = useSelector((state) => state.auth.userData);
    const debounceTimeout = useRef(null);

    const [state, setState] = useState({
        showDropdown: false,
        searchList: [],
        searchText: '',
    });
    const { showDropdown, searchList, searchText } = state;
    const updateState = (data) => setState((prev) => ({ ...prev, ...data }));

    // useEffect(() => {
    //     console.log('Header userdata', userData)
    //     clearData();
    // }, [])

    useFocusEffect(
        useCallback(() => {
            clearData();
        }, [])
    );

    const fetchResults = async (query) => {
        console.log('query', query)
        // updateState({ loading: true });
        // console.log('fetch item client id',item?.client_id);
        try {
            const response = await actions.getSearchItemsList(query);
            console.log('getSearchItemsList response', response);

            if (response && response?.length > 0) {
                updateState({
                    searchList: response,
                    showDropdown: true,
                });
            } else {
                updateState({
                    searchList: [],
                    showDropdown: false,
                });
            }
        } catch (error) {
            console.log('getSearchBooksList failed:', error.message);
            showCustomToast(LABELS.error, error.message);
        } finally {
            // updateState({ loading: false });
        }
    }
    const renderItem = ({ item }) => {
        console.log('item search', item);
        return <TouchableOpacity style={styles.item} onPress={() => handleSelectTitle(item)}>
            <Text style={styles.label}>{item.title || item.name || item.series_title || item.episode_title}</Text>
            {/* {(selectedListLabel.toLowerCase() === MISC.restaurants)
                ? <Text style={styles.label}>{item.name} - ({item?.location?.formatted_address})</Text>
                : selectedListLabel.toLowerCase() === MISC.wine
                    ? <Text style={styles.label}>{item?.winery} - {item?.variety}</Text>
                    : <Text style={styles.label}>
                        {item.title || item.name || item.series_title || item.episode_title}
                        {item?.release_date ? ` (${moment(item?.release_date, 'YYYY-MM-DD').year()})`
                            : item?.author ? ` (${item?.author})`
                                : item?.publisher ? ` - (${item?.publisher})`
                                    // : item?.type ? ` - (${item?.type})`
                                    : item?.brewery ? ` (${item?.brewery})` : ''}
                    </Text>} */}
        </TouchableOpacity>
    };

    const handleSelectTitle = (item) => {
        updateState({
            showDropdown: false,
            searchList: [],
            searchText: ''
        });
        navigation.navigate(ROUTES.itemDetailsScreen, { item: item })
    }

    const onChangeText = (text) => {
        updateState({ searchText: text });

        if (text.length == 0) {
            updateState({ showDropdown: false, searchList: [] });
        }
        else if (text.length > 2) {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

            // Debounce API call by 500ms
            debounceTimeout.current = setTimeout(() => {
                fetchResults(text.trim());
            }, 500);
        }
    };

    const clearData = () => {
        updateState({ showDropdown: false, searchList: [], searchText: '' })
    }

    return (
        <View>
            {!isBack && <View style={[styles.headerTitleView, { position: 'relative', marginTop: 8 }]}>
                <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
            </View>}
            <View style={styles.header}>

                {isBack && <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                    <Icon name={"chevron-back"} size={22} color={COLORS.black} style={styles.menuIcon} />
                </TouchableOpacity>}

                {isBack && <View style={styles.headerTitleView}>
                    <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
                </View>}
                {!isBack && <View style={styles.headerRight}>
                    <View style={styles.inputWrapper}>
                        <CustomInput
                            placeholder={LABELS.searchItems}
                            value={searchText}
                            maxLength={100}
                            onChangeText={onChangeText}
                            icon={searchText.length > 0 ? 'close-circle' : null}
                            isSearch={true}
                            iconPress={clearData}
                        />
                    </View>
                    {/* <TouchableOpacity style={styles.button} onPress={() => showCustomToast(LABELS.success, MISC.comingSoon)}>
                        <Image source={imagesPath.search} style={styles.search} />
                    </TouchableOpacity> */}
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate(ROUTES.profileScreen)}>
                        {userData?.avatar_url
                            ? <Image source={{ uri: userData?.avatar_url }} style={styles.avatar} />
                            : <Image source={imagesPath.avatarSample} style={styles.avatar} />}
                    </TouchableOpacity>
                </View>}

                {onMenuPress &&
                    <TouchableOpacity style={styles.button} onPress={onMenuPress}>
                        <Icon name={"ellipsis-vertical-sharp"} size={20} color={COLORS.black} />
                    </TouchableOpacity>}
                {rightText &&
                    <TouchableOpacity style={styles.button} onPress={onRightPress}>
                        <Text style={styles.rightText}>{rightText}</Text>
                    </TouchableOpacity>}
            </View>

            {showDropdown && searchList.length > 0 && (title.length > 0)
                && (
                    <View style={[styles.listAbsolute,]}>
                        <ScrollView horizontal
                            contentContainerStyle={{
                                maxHeight: 280, width: SCREEN_WIDTH - 54,
                                flexGrow: 1
                            }}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={false}>
                            <FlatList
                                data={searchList}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={renderItem}
                                contentContainerStyle={{ padding: 8, gap: 8, flexGrow: 1 }}
                                // keyboardShouldPersistTaps="handled"
                                showsHorizontalScrollIndicator={false}
                                nestedScrollEnabled={true}
                                scrollEnabled={true}
                            />
                        </ScrollView>
                    </View>
                )}
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        borderBottomWidth: 1,
        borderColor: COLORS.lighterGray,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    inputWrapper: {
        flex: 1,
        // marginRight: 8,
    },
    menuIcon: {
        zIndex: 1,
    },
    headerTitleView: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: -1,
        alignItems: 'center'
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'center',
        width: '50%',
    },
    headerRight: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // optional spacing
    },
    button: { paddingHorizontal: 4, paddingVertical: 8 },
    search: {
        width: 24,
        height: 24,
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 14,
    },
    rightText: {
        fontSize: 18,
        color: COLORS.accent
    },
    listAbsolute: {
        position: "absolute",
        top: 100,
        left: 16,
        right: 54,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        maxHeight: 350,
        zIndex: 10,
    },
    item: {
        padding: 4,
        borderBottomColor: '#eee',
        // borderBottomWidth: 1,
    },
    label: { fontWeight: '400', fontSize: 16, color: COLORS.black, },
});

//make this component available to the app
export default Header;
