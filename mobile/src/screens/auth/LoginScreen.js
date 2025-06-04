import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  Keyboard,
} from 'react-native';
import {
  CustomInput,
  CustomButton,
  CustomToast,
  showCustomToast,
} from '../..';
import { ROUTES, STRINGS } from '../../constants/strings';
import COLORS from '../../constants/colors';
import imagesPath from '../../constants/images';
import { login, setSession } from '../../lib/supabase';
import validator from '../../utils/validators';
import constants from '../../constants/constants';
import { getData, setData } from '../../utils/utils';
import { saveUserData } from '../../redux/actions/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen({ navigation }) {
  const [state, setState] = useState({
    email: '',
    password: '',
    rememberMe: false,
    loading: false,
    secureText: true,
  });

  const {
    email,
    password,
    rememberMe,
    loading,
    secureText,
  } = state;

  const updateState = (data) => setState((prev) => ({ ...prev, ...data }));


  const { LABELS, LOGIN, TITLES, MISC, VALIDATIONS, BUTTONS } = STRINGS;

  useEffect(() => {
    init();
  }, [])

  const init = async () => {
    // const rememberMe = await getData(constants.REMEMBER_ME);
    const rememberMeEmail = await getData(constants.EMAIL);
    const rememberMePassword = await getData(constants.PASSWORD);
    updateState({
      rememberMe: rememberMe,
      email: rememberMeEmail,
      password: rememberMePassword,
    })
  }

  const handleLogin = async () => {
    Keyboard.dismiss();
    const validation = validator.isValidData(
      {
        email,
        passwordLogin: password,
      }
    );
    if (!validation.valid) {
      showCustomToast(LABELS.error, validation.message);
      return;
    }
    updateState({ loading: true });
    try {
      const userData = await login(email, password);
      console.log('Login data: ' + JSON.stringify(userData));
      await setData(constants.USER_DATA, JSON.stringify(userData));
      // await setData(constants.REMEMBER_ME, rememberMe);
      await setData(constants.EMAIL, rememberMe ? email : '');
      await setData(constants.PASSWORD, rememberMe ? password : '');
      // await setSession(userData?.access_token, userData?.refresh_token);
      const token = { access_token: userData?.access_token };
      console.log("token", token, userData?.access_token)
      await setData(constants.TOKEN, JSON.stringify(token))
      saveUserData(userData)
      showCustomToast(LABELS.success, "Login successful");
    } catch (error) {
      console.log('Login Failed: ' + JSON.stringify(error))
      showCustomToast(LABELS.error, 'Login Failed: ' + error.message);
    } finally {
      updateState({ loading: false });
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
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image source={imagesPath.logo} style={styles.image} />
              <Text style={styles.logoTitle}>{TITLES.appName}</Text>
            </View>

            <Text style={styles.mainTitle}>{LOGIN.title}</Text>
            <Text style={styles.subTitle}>{LOGIN.subtitle}</Text>

            {/* Email Input */}
            <CustomInput
              placeholder={LABELS.emailPlaceholderText}
              value={email}
              onChangeText={(val) => updateState({ email: val.replace(/[^A-Za-z0-9@.]/g, '') })}
              label={LABELS.emailAddress}
            />

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <CustomInput
                label={LABELS.password}
                value={password}
                onChangeText={(val) => updateState({ password: val.replace(/[^A-Za-z0-9!@#$%^&*(),.?":{}|<>]/g, '') })}
                placeholder={LABELS.password}
                secureTextEntry={secureText}
                icon={secureText ? 'eye-off-outline' : 'eye-outline'}
                iconPress={() => updateState({ secureText: !secureText })}
              />
            </View>

            {/* Options Row */}
            <View style={styles.optionsRow}>
              <View style={styles.rememberRow}>
                <Switch
                  value={rememberMe}
                  onValueChange={(val) => updateState({ rememberMe: val })}
                  trackColor={{ false: COLORS.lightBg, true: COLORS.accent }}
                  thumbColor={COLORS.white}
                  style={{
                    transform: Platform.OS === 'android'
                      ? [{ scaleX: 1 }, { scaleY: 1 }] : [{ scaleX: .7 }, { scaleY: .7 }]
                  }}
                />
                <Text style={styles.rememberText}>{LABELS.rememberMe}</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate(ROUTES.forgotPassword)}>
                <Text style={styles.forgotText}>{BUTTONS.forgotPassword}</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <CustomButton title={BUTTONS.signin} onPress={handleLogin} disabled={loading} />

            {/* Loading Text */}
            {loading && (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color={COLORS.accent} />
                <Text style={styles.loadingText}>{VALIDATIONS.loginLoaderText}</Text>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>{MISC.newHere}</Text>
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.signup)}>
              <Text style={styles.signUpLink}>{BUTTONS.signup}</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>{MISC.quickAndFree}</Text>
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
    flexGrow: 1,
  },
  mainView: {
    flexGrow: 1,
    padding: 16
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  image: {
    width: 50,
    height: 50,
  },
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
  inputContainer: {
    marginVertical: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: 4,
    fontSize: 16,
    color: COLORS.black,
  },
  forgotText: {
    fontSize: 16,
    color: COLORS.accent,
    textDecorationLine: 'underline',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.accent,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: COLORS.secondary,
    flexWrap: 'wrap',
  },
  footerText: {
    color: COLORS.text_secondary,
    fontWeight: '400',
    fontSize: 16,
  },
  signUpLink: {
    color: COLORS.accent,
    fontWeight: '400',
    fontSize: 16,
    paddingHorizontal: 4,
    textDecorationLine: 'underline'
  },
});
