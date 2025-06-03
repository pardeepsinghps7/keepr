import React from 'react';
import {
    Modal,
    View,
    ActivityIndicator,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import COLORS from '../constants/colors';

const Loader = ({ modalVisible, onDismiss }) => {
    if (!modalVisible) return null;

    return (
        <TouchableWithoutFeedback onPress={onDismiss}>
            <View style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.3)',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}>
                <ActivityIndicator size="large" color={COLORS.black} />
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderContainer: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#333',
    },
});

export default Loader;
