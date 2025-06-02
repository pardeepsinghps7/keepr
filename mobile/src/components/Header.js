//import liraries
import React, { Component, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import COLORS from '../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import imagesPath from '../constants/images';
import { ROUTES, STRINGS } from '../constants/strings';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { showCustomToast } from '../utils/helpers';

// create a component
const Header = ({
    title,
    isBack = false,
    onMenuPress,
    onLeftIconTap,
}) => {
    const { LABELS, MISC } = STRINGS
    const navigation = useNavigation();
    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        console.log('Header userdata', userData)
    }, [])
    return (
        <View style={styles.header}>

            <TouchableOpacity onPress={() => isBack ? navigation.goBack() : showCustomToast(LABELS.success, MISC.comingSoon)}>
                {
                    isBack
                        ? <Icon name={"chevron-back"} size={22} color={COLORS.black} style={styles.menuIcon} />
                        : <Icon name={"menu"} size={24} color={COLORS.black} style={styles.menuIcon} />
                }
            </TouchableOpacity>

            <Text style={styles.headerTitle}>{title}</Text>

            {!isBack && <View style={styles.headerRight}>
                <TouchableOpacity onPress={() => showCustomToast(LABELS.success, MISC.comingSoon)}>
                    <Image source={imagesPath.search} style={styles.search} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showCustomToast(LABELS.success, MISC.comingSoon)}>
                    <Icon name="notifications-outline" size={24} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate(ROUTES.profileScreen)}>
                    {userData?.avatar_url
                        ? <Image source={{ uri: userData?.avatar_url }} style={styles.avatar} />
                        : <Image source={imagesPath.avatarSample} style={styles.avatar} />}
                </TouchableOpacity>
            </View>}
            {onMenuPress &&
                <TouchableOpacity onPress={onMenuPress}>
                    <Icon name="ellipsis-vertical-sharp" size={20} color={COLORS.black} />
                </TouchableOpacity>}
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
        padding: 16
    },
    menuIcon: {
        zIndex: 1,
    },
    headerTitle: {
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '400',
        zIndex: -1,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        zIndex: 1,
    },
    search: {
        width: 24,
        height: 24,
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 14,
    },
});

//make this component available to the app
export default Header;
