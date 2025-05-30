import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  Keyboard,
  ScrollView
} from 'react-native';
import { forgotPassword } from '../../lib/supabase';
import { ROUTES, STRINGS } from '../../constants/strings';
import COLORS from '../../constants/colors';
import imagesPath from '../../constants/images';
import { CustomButton, CustomInput, CustomToast, showCustomToast, showSuccess } from '../..';
import validator from '../../utils/validators';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen({ navigation }) {
  const { LABELS, TITLES, FORGOT_PASSWORD, MISC, VALIDATIONS, BUTTONS } = STRINGS;

  const [state, setState] = useState({
    email: '',
    previousEmail: '',
    status: 'idle', // 'idle' | 'loading' | 'sent'
    error: '',
    toastVisible: false,
  });

  const updateState = (data) => setState((prev) => ({ ...prev, ...data }));

  const {
    email,
    previousEmail,
    status,
    error,
    toastVisible,
  } = state;

  const handleForgotPassword = async () => {
    Keyboard.dismiss();
    const validation = validator.isValidData(
      {
        email,
      }
    );
    if (!validation.valid) {
      showCustomToast(LABELS.error, validation.message);
      return;
    }
    try {
      updateState({ status: 'loading', error: '', toastVisible: true, previousEmail: email });
      await forgotPassword(email);
      showCustomToast(LABELS.success, FORGOT_PASSWORD.sentResetLinkToast)
      updateState({
        status: 'sent',
        email: ''
      });
      setTimeout(() => {
        updateState({
          toastVisible: false,
        });
      }, 3000);

    } catch (error) {
      updateState({
        status: 'idle',
        // error: 'Something went wrong. Try again.',
      });
      console.log('forgot', error.message)
      showCustomToast(LABELS.error, error.message || MISC.somethingWentWrong)
    }
  };

  const resendLink = async () => {
    try {
      Keyboard.dismiss();
      updateState({ status: 'loading', error: '', toastVisible: true, });
      await forgotPassword(previousEmail);
      showCustomToast(LABELS.success, FORGOT_PASSWORD.sentResetLinkToast)
      updateState({
        status: 'sent',
      });
      setTimeout(() => {
        updateState({
          toastVisible: false,
        });
      }, 3000);
    } catch (e) {
      updateState({
        status: 'idle',
        error: 'Unable to resend. Try again.',
      });
      showCustomToast(LABELS.error, MISC.unableToResend)
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.mainView}>
            <View style={styles.logoContainer}>
              <Image source={imagesPath.logo} style={styles.image} />
              <Text style={styles.logoTitle}>{TITLES.appName}</Text>
            </View>

            <Text style={styles.mainTitle}>{FORGOT_PASSWORD.title}</Text>
            <Text style={styles.subTitle}>{FORGOT_PASSWORD.subtitle}</Text>

            <CustomInput
              label={LABELS.emailAddress}
              value={email}
              onChangeText={(val) => updateState({ email: val.replace(/[^A-Za-z0-9@.]/g, '') })}
              placeholder={LABELS.emailPlaceholderText}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            {/* {!!error && <Text style={styles.errorText}>{error}</Text>} */}

            <Text style={styles.confirmText}>{FORGOT_PASSWORD.sendResetLink}</Text>

            <CustomButton
              title={BUTTONS.sendResetLink}
              // title={status === 'sent' ? BUTTONS.linkSent : BUTTONS.sendResetLink}
              onPress={handleForgotPassword}
              disabled={status === 'loading'}
              style={{
                marginBottom: 8
              }}
            // icon={status === 'sent' && 'checkmark-circle-outline'}
            />

            {status === 'loading' && (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color={COLORS.accent} />
                <Text style={styles.loadingText}>{FORGOT_PASSWORD.resetLoaderText}</Text>
              </View>
            )}

            {
              status === 'sent' && toastVisible === false && (
                <>
                  <Text style={styles.resendInfo}>{MISC.notGetEmail}</Text>
                  <TouchableOpacity style={styles.resendContainer} onPress={resendLink}>
                    <Image source={imagesPath.resend} style={styles.resendIcon} />
                    <Text style={styles.resendLink}>{MISC.resendIt}</Text>
                  </TouchableOpacity>
                </>
              )
            }
            {
              status === 'sent' && toastVisible === true && (

                <View style={styles.linkSentContainer}>
                  <Icon name={'checkmark-circle-outline'} size={24} color={COLORS.accent} />
                  <Text style={styles.resendLink}>{BUTTONS.linkSent}</Text>
                </View>
              )
            }
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{MISC.changeMind} </Text>
            <TouchableOpacity onPress={() => navigation.replace(ROUTES.login)} style={styles.signinContainer}>
              <Icon name="arrow-back" size={16} color={COLORS.accent} />
              <Text style={styles.signInLink}>{BUTTONS.backToSignIn}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flexGrow:1,
  },
  mainView:{
    flexGrow:1,
    padding: 16
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  image: { width: 50, height: 50, },
  logo: {
    backgroundColor: COLORS.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoTitle: {
    fontWeight: '700',
    fontSize: 36,
    color: COLORS.black,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    color: COLORS.text_secondary,
    marginBottom: 32,
  },
  errorText: {
    color: '#C00',
    marginBottom: 8,
    fontSize: 13,
  },
  confirmText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 0,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.accent,
  },
  successBox: {
    backgroundColor: COLORS.green20,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.green20
  },
  successText: {
    color: COLORS.green,
    fontSize: 14,
  },
  linkSentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
  },
  resendInfo: {
    textAlign: 'center',
    marginVertical: 8,
    fontSize: 16,
    color: COLORS.text_secondary,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    marginTop: 4,
  },
  resendIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },
  resendLink: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    padding: 16,
    borderTopWidth: 1,
    borderColor: COLORS.secondary,
    flexWrap: 'wrap', // useful if on small screens
  },
  signinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  footerText: {
    color: COLORS.text_secondary,
    fontWeight: '400',
    fontSize: 16,
  },
  signInLink: {
    color: COLORS.accent,
    fontWeight: '400',
    fontSize: 16,
    paddingHorizontal: 4
  },
});
