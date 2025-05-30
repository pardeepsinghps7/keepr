//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Modal } from 'react-native';

// create a component
const Loader = ({
    modalVisible
}) => {
    return (
        <Modal
            transparent={true}
            animationType={'none'}
            visible={modalVisible}
            onRequestClose={() => { console.log('close modal') }}>
            <View style={styles.containter}>
                <View style={styles.activityIndicatorWrapper}>
                    <ActivityIndicator
                        animating={modalVisible}
                        color={'white'}
                        size={'large'} />
                </View>
            </View>
        </Modal>
    );
};

// define your styles
const styles = StyleSheet.create({
    containter: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: `rgba(0,0,0,0.5)`
    }
});

//make this component available to the app
export default Loader;
