// /src/screens/recaptcha/RecaptchaScreen.js
import React, { useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, SafeAreaView } from 'react-native';
import Recaptcha from 'react-native-recaptcha-that-works';
import CheckBox from 'react-native-check-box';
import imagesPath from '../../constants/images';
import { ROUTES, STRINGS } from '../..';
import COLORS from '../../constants/colors';
import { setData } from '../../utils/utils';

const RecaptchaScreen = ({ navigation }) => {
    const { MISC } = STRINGS
    const [isVerified, setIsVerified] = useState(false);

    const recaptcha = useRef();
    const [isAgree, setIsAgree] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const send = async () => {
        await setData(MISC.isFirstTime, '1')
        navigation.replace(ROUTES.signup)
        // console.log('send!');
        // setIsAgree(!isAgree)
        // recaptcha.current.open();
    }

    const onVerify = async (token) => {
        console.log('success!', token);
        try {
            setIsLoading(true)
            // const res = await actions.signup(item, appLanguage)
            // console.log('resssss recaptcha', res)
            // // showSuccess(res?.message || res?.msg)
            // // navigation.navigate(constants.OTP,
            // //     {
            // //         type: constants.SIGNUP, email: email,
            // //         mobile: mobile, user_id: res.data?._id
            // //     })

            // //below new change otp verify remove
            // const res1 = await actions.getUserInfo(res?.data?._id);
            // const response = res1?.data[0]
            // const token = { access_token: res1?.token };
            // await setData(constants.TOKEN, JSON.stringify(token))
            // setIsLoading(false)
            // await setData(MISC.isFirstTime, '1')
            navigation.navigate(ROUTES.signup)

        } catch (error) {
            setIsLoading(false)
            console.log("error raised", error)
            showError(error?.message || error?.msg)
        }
    }

    const onExpire = () => {
        console.warn('expired!');
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                automaticallyAdjustKeyboardInsets={true}
                contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    <Image source={imagesPath.robot}
                        style={styles.imageStyle}
                    />
                    <Text style={styles.title}>
                        {STRINGS.RECAPTCHA.title}
                    </Text>
                    <Text style={styles.subtitle}>
                        {STRINGS.RECAPTCHA.subtitle}
                    </Text>

                    <TouchableOpacity
                        onPress={send}
                        style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            borderWidth: 0.5,
                            borderColor: COLORS.gray,
                            backgroundColor: COLORS.lighterGray,
                            padding: 16,
                            marginTop: 32,
                            borderRadius: 4
                        }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                        }}>
                            <CheckBox
                                isChecked={isAgree}
                                onClick={send}
                                checkedCheckBoxColor={COLORS.gray}
                                uncheckedCheckBoxColor={COLORS.gray}
                                pointerEvents="none"
                            />
                            <Text style={[{ fontSize: 16, fontWeight: '400', color: COLORS.black }]}>
                                {STRINGS.RECAPTCHA.notRobotText}
                            </Text>
                        </View>
                        <View style={{ alignItems: 'center', gap: 4 }}>
                            <Image source={imagesPath.recaptcha} style={{ width: 70, height: 50, resizeMode: 'contain', }} />
                            <Text style={[{ fontSize: 8, fontWeight: '400', color: COLORS.gray }]}>
                                {STRINGS.RECAPTCHA.privacyTerms}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <Recaptcha
                        ref={recaptcha}
                        // hideBadge={true}
                        // hideLoader={true}
                        siteKey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                        baseUrl="https://djaberapi.trigma.in"
                        // baseUrl="http://my.domain.com"
                        onVerify={onVerify}
                        onExpire={onExpire}
                        size="invisible"
                        style={{ opacity: 0, position: 'absolute', width: 1, height: 1 }}
                    />
                    {/* <Button title="Send" onPress={send} /> */}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        // paddingBottom:48,
        backgroundColor:COLORS.white
    },
    imageStyle: {
        width: 164,
        height: 220,
        resizeMode: 'contain',
        marginVertical: 32
    },
    title: {
        fontWeight: 'bold',
        fontSize: 22,
        textAlign: 'center',
        color: COLORS.black,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.text_secondary,
        textAlign: 'center',
        // paddingHorizontal: 16,
    },
});

export default RecaptchaScreen;
