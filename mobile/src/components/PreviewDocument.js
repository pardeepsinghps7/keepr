import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import COLORS from '../constants/colors';

const PreviewDocument = ({
    modalVisible,
    item,
    onClose,
}) => {
    // console.log('checkkkkkkk', item)

    const [loading, setLoading] = useState(true);
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onTouchCancel={true}
        >
            <View style={styles.centeredView}>

                <View style={[styles.modalView, { backgroundColor: COLORS.white }]}>
                    <TouchableOpacity
                        style={{ position: 'absolute', right: 8, top: 8 }}
                        onPress={onClose}
                    >
                        <Ionicons
                            name={'close-circle-sharp'}
                            size={24}
                            color={COLORS.black}
                        />
                    </TouchableOpacity>
                    {/* <Text style={[styles.modalText, { fontSize: 22, color: theme.whiteColor }]}>{name}</Text>
                    <Text style={{
                        fontSize: 14,
                        color: theme.labelColor,
                        textAlign: 'left',
                        marginVertical: 8
                    }}>
                        {date}
                    </Text> */}
                    {/* {loading && <ActivityIndicator size="large" color={theme.whiteColor} style={styles.loader} />} */}
                    <Image
                        source={{ uri: item }}
                        style={styles.logoStyle}
                        onLoadEnd={() => setLoading(false)} // Hide loader when image loads
                        onError={() => setLoading(false)}
                    />
                    {/* <TouchableOpacity
                        onPress={onDownloadPress}
                        style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', gap: 8 }}
                    >
                        <MaterialIcons
                            name={constants.DOWNLOAD}
                            size={28}
                            color={theme.blue}
                        />
                        <Text style={{
                            fontSize: 14,
                            color: theme.titleColor,
                            fontWeight: '500'
                        }}>
                            {BUTTON.DOWNLOAD_REPORT}
                        </Text>
                    </TouchableOpacity> */}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'left',
    },
    logoStyle: {
        width: Dimensions.get('screen').width / 1.3,
        height: Dimensions.get('screen').height / 2,
        resizeMode: 'contain',
        marginVertical: 16,
    },
    loader: {
        width: Dimensions.get('screen').width / 1.3,
        height: Dimensions.get('screen').height / 2,
    }
});

export default PreviewDocument;