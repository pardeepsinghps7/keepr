//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import imagesPath from '../constants/images';
import { STRINGS } from '../constants/strings';
import COLORS from '../constants/colors';

// create a component
const NoInternetComponent = ({ onPress }) => {
    const { MISC } = STRINGS
    return (
        <View style={styles.emptyContainer} onPress={onPress}>
            <Image style={styles.noInternetImageStyle} source={imagesPath.noInternet} />
            <Text style={styles.title}>{MISC.oops}</Text>
            <Text style={styles.subTitle}>{MISC.somethingWentWrongWhileLoading}</Text>
            <TouchableOpacity style={styles.tryAgainContainer} onPress={onPress}>
                <Image style={styles.resendImageStyle} source={imagesPath.resend} />
                <Text style={styles.tryAgainTitle}>{MISC.tryAgain}</Text>
            </TouchableOpacity>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    emptyContainer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    noInternetImageStyle: {
        width: 40,
        height: 32,
        resizeMode: 'contain'
    },
    title: {
        fontSize: 14,
        fontWeight: '400',
        color: COLORS.text_secondary
    },
    subTitle: {
        fontSize: 12,
        fontWeight: '400',
        color: COLORS.text_secondary
    },
    tryAgainContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    resendImageStyle: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    tryAgainTitle: {
        fontSize: 16,
        fontWeight: '400',
        color: COLORS.accent
    },
});

//make this component available to the app
export default NoInternetComponent;
