import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import imagesPath from '../../constants/images';
import COLORS from '../../constants/colors';
import { ROUTES, STRINGS } from '../../constants/strings';
import { Header, Loader, showCustomToast } from '../../index.js';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import actions from '../../redux/actions/index.js';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { saveUserData } from '../../redux/actions/auth.js';
import { setData } from '../../utils/utils.js';
import constants from '../../constants/constants.js';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const HomeScreen = ({ navigation }) => {
    const { LABELS, MISC } = STRINGS;
    const isFocused = useIsFocused();
    const userData = useSelector((state) => state.auth.userData)
    const [state, setState] = useState({
        dataList: [],
        loading: false,
        latestItem: {},
    });

    const updateState = (data) => setState((prev) => ({ ...prev, ...data }));

    const { dataList, loading, latestItem } = state;

    useFocusEffect(
        useCallback(() => {
            init();
        }, [])
    );

    const init = async () => {
        updateState({ loading: true });
        try {
            const response = await actions.getUserListWithItemCount();
            const userDetails = await actions.getProfileDetail();
            const latestItemResopnse = await actions.getLatestAddedItem();
            // console.log('latestItemResopnse response', latestItemResopnse);
            await setData(constants.USER_DATA, JSON.stringify({
                ...userData,
                first_name: userDetails[0]?.first_name,
                last_name: userDetails[0]?.last_name,
                email: userDetails[0]?.email,
                avatar_url: userDetails[0]?.avatar_url
            }));
            saveUserData({
                ...userData,
                first_name: userDetails[0]?.first_name,
                last_name: userDetails[0]?.last_name,
                email: userDetails[0]?.email,
                avatar_url: userDetails[0]?.avatar_url
            });
            updateState({ dataList: response.slice(0, 20), latestItem: latestItemResopnse[0] });
        } catch (error) {
            console.log('getUserListWithItemCount failed:', error.message);
            showCustomToast(LABELS.error, error.message);
        } finally {
            updateState({ loading: false });
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(ROUTES.listDetailsScreen, { item })}>
            <Image style={styles.iconImageStyle} source={{ uri: item.icon }} />
            <Text style={styles.cardTitle} numberOfLines={2}>{item.label}</Text>
            <Text style={styles.itemCount}>{item.items_count} Items</Text>
            <View style={styles.arrow}>
                <MaterialIcons name="chevron-right" size={20} color={COLORS.black} />
            </View>
        </TouchableOpacity>
    );

    const onLeftIconTap = () => {
        console.log('helllll');
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Loader modalVisible={loading} />
            <Header title={ROUTES.listkeeprHome} onLeftIconTap={onLeftIconTap} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 0, }}
                keyboardShouldPersistTaps="handled"
            >
            <View style={styles.viewContainer}>
                <Text style={styles.welcome}>Welcome {userData?.first_name ? `${userData?.first_name} ` : ''}<Text style={styles.wave}>👋</Text></Text>
                <Text style={styles.subtext}>Your clever space to keep what you love.</Text>
                <View style={styles.mainView} >
                    <View style={styles.row}>
                        <TouchableOpacity
                            style={[styles.card, { alignItems: 'center', justifyContent: 'center' }]}
                            onPress={() => navigation.navigate(ROUTES.quickAdd)}
                        >
                            <Icon name="add" size={20} color={COLORS.accent} style={styles.plus} />
                            <Text style={styles.addLabel}>Quick Add</Text>
                        </TouchableOpacity>


                        <TouchableOpacity style={[styles.card, { justifyContent: 'flex-start' }]} onPress={() =>
                            (latestItem?.title || latestItem?.series_title || latestItem?.episode_title)
                                ? navigation.navigate(ROUTES.itemDetailsScreen, { item: latestItem })
                                : null}>
                            <Text style={styles.latestTitle}>Latest Added</Text>
                            {(latestItem?.title || latestItem?.episode_title || latestItem?.series_title) &&
                                <><View style={styles.latestRow}>
                                    <Image source={{ uri: latestItem?.lists?.icon }} style={styles.latestMovieImageStyle} />
                                    <Text style={styles.latestText} numberOfLines={1}>{latestItem?.title || latestItem?.episode_title || latestItem?.series_title}</Text>
                                </View>
                                    <View style={[styles.latestRow, { marginTop: 4 }]}>
                                        <Image source={imagesPath.watch} style={styles.watchImageStyle} />
                                        <Text style={styles.latestSub} numberOfLines={1}>{latestItem?.status?.replace(/_/g, ' ')}</Text>
                                    </View>
                                    <Text style={styles.latestSub} numberOfLines={1}>{moment(latestItem?.updated_at || latestItem?.created_at).fromNow()}</Text>
                                </>}
                        </TouchableOpacity>
                    </View>

                    {/* FlatList Grid */}
                    <FlatList
                        data={dataList}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        columnWrapperStyle={styles.grid}
                        contentContainerStyle={{ padding: 2 }}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                        scrollEnabled={false}
                    />
                </View>
            </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    viewContainer: {
        flex: 1,
        padding: 16
    },
    welcome: {
        marginVertical: 8,
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.black,
    },
    wave: {
        fontSize: 28,
    },
    subtext: {
        fontSize: 16,
        color: COLORS.text_secondary,
        marginBottom: 20,
    },
    mainView: { paddingVertical: 16 },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingHorizontal: 4,
    },
    plus: {
        color: COLORS.accent,
        backgroundColor: COLORS.secondary,
        padding: 4,
        borderRadius: 16,
    },
    addLabel: {
        fontSize: 16,
        marginTop: 12,
        color: COLORS.accent,
    },
    latestTitle: {
        fontWeight: '400',
        color: COLORS.accent,
        fontSize: 18,
        marginBottom: 8,
    },
    latestRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    latestMovieImageStyle: {
        width: 24,
        height: 20,
        resizeMode: 'contain',
    },
    watchImageStyle: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
    },
    latestText: {
        fontSize: 14,
        color: COLORS.black,
        fontWeight: '400',
        marginLeft: 6,
        flexShrink: 1,
    },
    latestSub: {
        fontSize: 12,
        color: COLORS.text_secondary,
        textTransform: 'capitalize',
        flex: 1,
        flexShrink: 1,
    },
    grid: {
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 20,
    },
    card: {
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        width: '47%',
        height: SCREEN_HEIGHT / 5.5,
        padding: 16,
        elevation: 5,
        shadowColor: COLORS.accent,
        shadowOpacity: 0.07,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 8,
        position: 'relative',
        shadowColor: '#000',
        overflow: 'visible'
    },
    iconImageStyle: {
        width: 36,
        height: 36,
        resizeMode: 'contain',
        tintColor: COLORS.accent,
    },
    cardTitle: {
        marginTop: 12,
        fontSize: 18,
        fontWeight: '400',
        color: COLORS.text_secondary,
    },
    itemCount: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: '400',
        color: COLORS.text_secondary,
    },
    arrow: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        padding: 2,
        borderTopLeftRadius: 8,
        borderBottomRightRadius: 8,
        backgroundColor: COLORS.secondary,
    },
});
