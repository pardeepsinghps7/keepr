import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import COLORS from '../../constants/colors'; // Assuming COLORS is defined elsewhere
import { ROUTES, STRINGS } from '../../constants/strings'; // Assuming ROUTES is defined elsewhere
import { CustomButton, CustomInput, Header, Loader, showCustomToast, } from '../..';
import imagesPath from '../../constants/images';
import ImageSelectionModal from '../../components/ImageSelectionModal';
import { logoutSupabase, uploadAvatarToSupabase } from '../../lib/supabase';
import validator from '../../utils/validators';
import { useSelector } from 'react-redux';
import actions from '../../redux/actions';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { saveUserData } from '../../redux/actions/auth';
import { convertAvatarTimestamp, setData } from '../../utils/utils';
import constants from '../../constants/constants';

const ProfileScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const userData = useSelector((state) => state.auth.userData);
  // console.log('hey user', userData?.user?.email)
  const { LABELS, TITLES, SIGNUP, MISC, VALIDATIONS, BUTTONS } = STRINGS;
  const [state, setState] = useState({
    email: '',
    modalVisible: false,
    avatar: null,
    loading: false,
    imageLoading: false,
    isUpdateAvatar: false,
    userDetails: {}
  });

  const updateState = (data) => setState((prev) => ({ ...prev, ...data }));

  const {
    email,
    modalVisible,
    avatar,
    loading,
    imageLoading,
    isUpdateAvatar,
    userDetails,
  } = state;

  useFocusEffect(
    useCallback(() => {
      init();
    }, [])
  );

  const init = async () => {
    updateState({ loading: true });
    try {
      const userDetails = await actions.getProfileDetail();
      // console.log('getProfileDetail response', userDetails, userData);
      updateState({
        email: userDetails[0]?.email || userData?.user?.email,
        avatar: convertAvatarTimestamp(userDetails[0]?.avatar_url) || null,
        isUpdateAvatar: userDetails[0]?.avatar_url,
        userDetails: userDetails[0],
      });
    } catch (error) {
      console.log('getProfileDetail failed:', error.message);
      showCustomToast(LABELS.error, error.message);
    } finally {
      updateState({ loading: false });
    }
  };

  // 👇 Track avatar change and reset loading state
  useEffect(() => {
    if (avatar) {
      updateState({ imageLoading: true });
    }
  }, [avatar]);

  const handleLogout = async () => {
    updateState({ isLoading: true })
    try {
      await logoutSupabase();
      actions.logout();
      showCustomToast(LABELS.success, 'Logout Successfully');

    } catch (error) {
      console.log("error raised", error)
      showCustomToast(LABELS.error, error?.message || error?.msg)
    } finally {
      updateState({ loading: false });
    }
  }

  const onImageSelectedHandler = async (uri, isAvatarImage) => {
    updateState({ loading: true });
    try {
      if (!isAvatarImage) {
        const avatarUrl = await uploadAvatarToSupabase(uri, userData?.user?.id);
        if (!avatarUrl?.publicURL) {
          showCustomToast(LABELS.error, 'Failed to get public URL from Supabase');
          return;
        }
        const payload = { email: email, avatar_url: avatarUrl.publicURL };
        isUpdateAvatar
          ? await actions.updateProfileDetail(userDetails?.id, payload)
          : await actions.addProfileDetail(payload);
        updateState({ avatar: convertAvatarTimestamp(avatarUrl.publicURL) });
        await setData(constants.USER_DATA, JSON.stringify({ ...userData, email: email, avatar_url: avatarUrl.publicURL }));
        saveUserData({ ...userData, email: email, avatar_url: avatarUrl.publicURL })
      } else {
        const payload = { email: email, avatar_url: uri };
        isUpdateAvatar
          ? await actions.updateProfileDetail(userDetails?.id, payload)
          : await actions.addProfileDetail(payload);
        updateState({ avatar: convertAvatarTimestamp(uri) });
        await setData(constants.USER_DATA, JSON.stringify({ ...userData, email: email, avatar_url: uri }));
        saveUserData({ ...userData, email: email, avatar_url: uri });
      }
      showCustomToast(LABELS.success, 'Profile added successfully');
    } catch (error) {
      console.log('Profile Upload Failed: ' + error.message);
      showCustomToast(LABELS.error, 'Profile Upload Failed: ' + error.message);
    } finally {
      updateState({ loading: false });
    }
  }
  const handleChangePassword = () => {
    // Add your navigation or action here
    // updateState({ addItemModalVisible: true });
    navigation.navigate(ROUTES.changePasswordScreen);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* <Loader modalVisible={loading} /> */}
          <Header title={ROUTES.profileScreen} isBack />
          <View style={styles.mainView}>

            {/* Profile Upload */}
            <View style={styles.profileCircle}>
              {avatar ? (
                <>
                  <Image source={{ uri: avatar }} style={styles.avatarImage}
                    onLoad={() => {
                      console.log('image loading true')
                      updateState({ imageLoading: true })
                    }}
                    onLoadStart={() => {
                      console.log('image loading true')
                      updateState({ imageLoading: true })
                    }}
                    onLoadEnd={() => {
                      console.log('image loading false')
                      updateState({ imageLoading: false })
                    }}
                  />
                  {imageLoading && (
                    <View style={styles.loaderOverlay}>
                      <ActivityIndicator size="small" color="#000" />
                    </View>
                  )}
                </>

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

            {!avatar && <View style={styles.addPhotoView}>
              <Text style={[styles.addPhotoText, { fontSize: 14 }]}>
                {SIGNUP.addImageTitle}
              </Text>
              <Text style={styles.addPhotoText}>{SIGNUP.addImageSubTitle}</Text>
            </View>}

            {/* Email */}
            <CustomInput
              label={LABELS.emailAddress}
              value={email}
              editable={false}
              backgroundColor={COLORS.lighterGray}
              onChangeText={(val) => updateState({ email: val.replace(/[^A-Za-z0-9@.]/g, '') })}
              placeholder={LABELS.emailPlaceholderText}
              mainViewProps={{ marginTop: 24 }}
            />

            <TouchableOpacity onPress={handleChangePassword} style={{ alignSelf: 'flex-end', paddingVertical: 8, paddingLeft: 8 }}>
              <Text style={styles.changePassword}>Change Password?</Text>
            </TouchableOpacity>

            {/* Sign Up Button */}
            <CustomButton
              title={BUTTONS.logout}
              onPress={handleLogout}
              style={styles.logout}
              textStyle={styles.logoutText}
            />

            {loading && (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color={COLORS.accent} />
                <Text style={styles.loadingText}>{VALIDATIONS.signupLoaderText}</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Image Picker Modal */}
        <ImageSelectionModal
          modalVisible={modalVisible}
          setModalVisible={(val) => updateState({ modalVisible: val })}
          onImageSelected={onImageSelectedHandler}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    // paddingVertical: 20,
    // paddingTop: 16
    flex: 1,
  },
  mainView: {
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
  },
  addPhotoText: {
    fontSize: 12,
    color: COLORS.text_secondary,
    textAlign: 'center',
  },

  changePassword: { fontWeight: '400', fontSize: 16, color: COLORS.accent, textDecorationLine: 'underline' },
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
  logout: {
    backgroundColor: COLORS.red,
  },
  logoutText: {
    color: COLORS.white,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0, left: 0,
    right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 40,
  },

});
