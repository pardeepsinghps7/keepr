import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../constants/colors'; // Assuming COLORS is defined elsewhere
import { ROUTES, STRINGS } from '../../constants/strings'; // Assuming ROUTES is defined elsewhere
import { CustomButton, CustomInput, downloadPDF, showCustomToast, showSuccess, } from '../..';
import imagesPath from '../../constants/images';
import { signUp } from '../../lib/supabase';
import validator from '../../utils/validators';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PRIVACY_POLICY_URL, TERMS_CONDITIONS_URL } from '../../constants/urls';

export default function SignupScreen({ navigation }) {
  const { LABELS, TITLES, SIGNUP, MISC, VALIDATIONS, BUTTONS } = STRINGS;
  const [state, setState] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    isFocus: false,
    secureText: true,
    secureConfirmText: true,
    agree: false,
    modalVisible: false,
    avatar: null,
    loading: false,
  });

  const updateState = (data) => setState((prev) => ({ ...prev, ...data }));

  const {
    email,
    password,
    confirmPassword,
    isFocus,
    secureText,
    secureConfirmText,
    agree,
    modalVisible,
    avatar,
    loading,
  } = state;

  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
    };
  };

  const passwordValidations = validatePassword(password);

  const handleSignup = async () => {
    Keyboard.dismiss();
    const validation = validator.isValidData(
      {
        // avatar: avatar,
        email,
        newPassword: password,
        confirmPassword,
        agree: agree,
      }
    );
    if (!validation.valid) {
      showCustomToast(LABELS.error, validation.message);
      return;
    }

    updateState({ loading: true });
    try {
      await signUp(email, password);

      // const userId = user.id;
      // if (!userId) {
      //   showCustomToast(LABELS.error, 'Signup failed. No user ID returned.');
      //   return;
      // }

      // const avatarUrl = await uploadAvatarToSupabase(avatar, userId);
      // if (!avatarUrl?.publicURL) {
      //   showCustomToast(LABELS.error, 'Failed to get public URL from Supabase');
      // }
      // await insertAvatarToProfile({ id: userId, email: email, avatar_url: avatarUrl.publicURL });

      showCustomToast(LABELS.success, 'Thank you for signing up with ListKeepr. ' +
        `A verification email has been sent to ${email}. ` +
        'Click the link in the email to activate the account and start using ListKeepr. ' +
        'If the email is not received, check the spam folder or contact us for assistance.', { duration: 10000 });
      updateState({
        email: '',
        password: '',
      })
      navigation.replace(ROUTES.login);
    } catch (error) {
      console.log('Signup Failed: ' + error.message);
      showCustomToast(LABELS.error, error.message);
    } finally {
      updateState({ loading: false });
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.mainView}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image source={imagesPath.logo} style={styles.image} />
              <Text style={styles.logoTitle}>{TITLES.appName}</Text>
            </View>

            <Text style={styles.mainTitle}>{SIGNUP.title}</Text>
            <Text style={styles.subTitle}>{SIGNUP.subTitle}</Text>

            {/* Profile Upload */}
            {/* <View style={styles.profileCircle}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarImage} />
              ) : (
                <Image source={imagesPath.addImage} style={styles.sampleImage} />
              )}
              <TouchableOpacity
                style={styles.cameraIcon}
                onPress={() => updateState({ modalVisible: true })}
              >
                <Image
                  source={avatar ? imagesPath.edit : imagesPath.camera}
                  style={styles.cameraImage}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.addPhotoView}>
              <Text style={[styles.addPhotoText, { fontSize: 14 }]}>
                {SIGNUP.addImageTitle}
              </Text>
              <Text style={styles.addPhotoText}>{SIGNUP.addImageSubTitle}</Text>
            </View> */}

            {/* Email */}
            <CustomInput
              label={LABELS.emailAddress}
              value={email}
              onChangeText={(val) => updateState({ email: val.replace(/[^A-Za-z0-9@.]/g, '') })}
              placeholder={LABELS.emailPlaceholderText}
            />

            {/* Password */}
            <View style={styles.inputContainer}>
              <CustomInput
                label={LABELS.newPassword}
                value={password}
                onChangeText={(val) => updateState({ password: val.replace(/[^A-Za-z0-9!@#$%^&*(),.?":{}|<>]/g, '') })}
                placeholder={LABELS.newPassword}
                secureTextEntry={secureText}
                icon={secureText ? 'eye-off-outline' : 'eye-outline'}
                iconPress={() => updateState({ secureText: !secureText })}
                onFocus={() => updateState({ isFocus: true })}
                onBlur={() => updateState({ isFocus: false })}
              />

              {isFocus && (
                <>
                  <Text style={[styles.validationText, { marginVertical: 8 }]}>
                    {MISC.passwordContainsText}
                  </Text>
                  <View style={styles.validationContainer}>
                    {[
                      { label: MISC.charactersLimit, valid: passwordValidations.length },
                      { label: MISC.uppercaseLetter, valid: passwordValidations.uppercase },
                      { label: MISC.lowercaseLetter, valid: passwordValidations.lowercase },
                      { label: MISC.oneNumber, valid: passwordValidations.number },
                      { label: MISC.onSymbol, valid: passwordValidations.specialChar },
                    ].map((item, index) => (
                      <View key={index} style={styles.validationItem}>
                        <MaterialIcons
                          name="radio-button-on"
                          size={18}
                          color={item.valid ? COLORS.green : COLORS.red}
                          style={{ marginRight: 6 }}
                        />
                        <Text style={styles.validationText}>{item.label}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </View>

            {/* Confirm Password */}
            <CustomInput
              label={LABELS.confirmNewPassword}
              value={confirmPassword}
              onChangeText={(val) => updateState({ confirmPassword: val.replace(/[^A-Za-z0-9!@#$%^&*(),.?":{}|<>]/g, '') })}
              placeholder={LABELS.confirmNewPassword}
              secureTextEntry={secureConfirmText}
              icon={secureConfirmText ? 'eye-off-outline' : 'eye-outline'}
              iconPress={() => updateState({ secureConfirmText: !secureConfirmText })}
            />
            {confirmPassword.length > 0 && confirmPassword !== password && (
              <Text style={styles.errorText}>{VALIDATIONS.passwordMismatch}</Text>
            )}
            {confirmPassword.length > 6 && confirmPassword === password && (
              <Text style={styles.successText}>{VALIDATIONS.passwordMatched}</Text>
            )}

            {/* Agree Checkbox */}
            <TouchableOpacity
              style={styles.agreeRow}
              onPress={() => updateState({ agree: !agree })}
            >
              <Icon
                name={agree ? 'checkbox' : 'square-outline'}
                size={24}
                color={COLORS.primary}
                style={{ marginLeft: -2 }}
              />
              <Text style={styles.agreeText}>
                {MISC.signupAgreeText}{' '}
                <Text style={{ textDecorationLine: 'underline', color: COLORS.accent }}
                  onPress={() => downloadPDF(TERMS_CONDITIONS_URL, 'terms-and-conditions.pdf')}>
                  {MISC.termsConditions}
                </Text>{' '}
                {MISC.and}{' '}
                <Text style={{ textDecorationLine: 'underline', color: COLORS.accent }}
                  onPress={() => downloadPDF(PRIVACY_POLICY_URL, 'privacy-policy.pdf')}>
                  {MISC.privacyPolicy}
                </Text>.
              </Text>
            </TouchableOpacity>

            {/* Sign Up Button */}
            <CustomButton title={BUTTONS.signup} onPress={handleSignup} />
            {loading && (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color={COLORS.accent} />
                <Text style={styles.loadingText}>{VALIDATIONS.signupLoaderText}</Text>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>{MISC.alreadyAccount}</Text>
            <TouchableOpacity onPress={() => navigation.replace(ROUTES.login)}>
              <Text style={styles.footerLink}> {BUTTONS.signin}</Text>
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
    flexGrow: 1,
    // paddingVertical: 20,
    // paddingTop: 16
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
  profileCircle: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    alignSelf: 'center'
  },
  avatarImage: {
    width: 92,
    height: 92,
    borderRadius: 92,
    resizeMode: 'cover'
  },
  sampleImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  cameraImage: {
    width: 20,
    height: 20,
  },
  cameraIcon: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoView: {
    marginTop: 8,
    marginBottom: 24,
  },
  addPhotoText: {
    fontSize: 12,
    color: COLORS.text_secondary,
    textAlign: 'center',
  },
  profileUploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileUploadText: {
    marginLeft: 8,
    color: COLORS.primary,
    fontWeight: '500',
    fontSize: 14,
  },
  inputContainer: {
    marginVertical: 12,
  },
  validationContainer: {
    // marginTop: 8,
  },
  validationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  validationText: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.text_secondary
  },
  errorText: {
    fontSize: 12,
    color: COLORS.red,
    marginTop: 4,
  },
  successText: {
    fontSize: 12,
    color: COLORS.green,
    marginTop: 4,
  },
  agreeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 12,
  },
  agreeText: {
    marginLeft: 8,
    marginTop: 2,
    fontSize: 14,
    color: COLORS.text_secondary,
    flex: 1,
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
  termsText: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
    marginVertical: 12,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  promiseLink: {
    color: COLORS.accent,
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'center'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: COLORS.secondary
  },
  footerText: {
    color: COLORS.text_secondary,
    fontWeight: '400',
    fontSize: 16
  },
  footerLink: {
    color: COLORS.accent,
    fontWeight: '400',
    fontSize: 16
  },

});
