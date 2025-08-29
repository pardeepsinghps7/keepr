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
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import COLORS from '../../constants/colors'; // Assuming COLORS is defined elsewhere
import { ROUTES, STRINGS } from '../../constants/strings'; // Assuming ROUTES is defined elsewhere
import { CustomButton, CustomInput, DeleteAccountPopupModal, FeedbackPopupModal, Header, ImportGoodreadPopupModal, inviteFriend, Loader, ProfileListPopupModal, showCustomToast, } from '../..';
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
import DeviceInfo from 'react-native-device-info';

const ProfileScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const userData = useSelector((state) => state.auth.userData);
  // console.log('hey user', userData?.user?.email)
  const { LABELS, TITLES, SIGNUP, MISC, VALIDATIONS, BUTTONS } = STRINGS;
  const [state, setState] = useState({
    firstname: '',
    lastname: '',
    email: '',
    modalVisible: false,
    avatar: null,
    loading: false,
    imageLoading: false,
    isUpdateAvatar: false,
    userDetails: {},
    isAvatarImage: false,
    avatar_url: null,

    feedbackText: '',
    deleteReasonText: '',
    importGoodreadsModalVisible: false,
    feedbackModalVisible: false,
    listActionModalVisible: false,
    editListModalVisible: false,
    deleteAccountModalVisible: false,
    appVersion: constants.APP_VERSION,
  });

  const updateState = (data) => setState((prev) => ({ ...prev, ...data }));

  const {
    firstname,
    lastname,
    email,
    modalVisible,
    avatar,
    loading,
    imageLoading,
    isUpdateAvatar,
    userDetails,
    isAvatarImage,
    avatar_url,
    selectedActionItem,
    importGoodreadsModalVisible,
    feedbackModalVisible,
    listActionModalVisible,
    feedbackText,
    deleteReasonText,
    deleteAccountModalVisible,
    appVersion,
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
      console.log('getProfileDetail response', userDetails, userData);
      updateState({
        email: userDetails[0]?.email || userData?.user?.email,
        avatar: convertAvatarTimestamp(userDetails[0]?.avatar_url) || null,
        firstname: userDetails[0]?.first_name,
        lastname: userDetails[0]?.last_name,
        avatar_url: userDetails[0]?.avatar_url,
        isUpdateAvatar: userDetails[0]?.avatar_url,
        userDetails: userDetails[0],
        appVersion: DeviceInfo.getVersion(),
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

  const onImageSelectedHandler = async (uri, isAvatarImage) => {
    updateState({ loading: true });
    try {
      if (!isAvatarImage) {
        const avatarUrl = await uploadAvatarToSupabase(uri, userData?.user?.id);
        if (!avatarUrl?.publicURL) {
          showCustomToast(LABELS.error, 'Failed to get public URL from Supabase');
          return;
        }
        updateState({
          avatar: convertAvatarTimestamp(avatarUrl.publicURL),
          isAvatarImage: true,
          avatar_url: avatarUrl.publicURL
        });
      } else {
        updateState({
          avatar: convertAvatarTimestamp(uri),
          isAvatarImage: false,
          avatar_url: uri,
        });
      }
    } catch (error) {
      console.log('Profile Upload Failed: ' + error.message);
      showCustomToast(LABELS.error, 'Profile Upload Failed: ' + error.message);
    } finally {
      updateState({ loading: false });
      setTimeout(() => {
        Keyboard.dismiss();
      }, 100);
    }
  }
  const handleChangePassword = () => {
    // Add your navigation or action here
    // updateState({ addItemModalVisible: true });
    navigation.navigate(ROUTES.changePasswordScreen);
  };

  const handleSavePress = async () => {
    Keyboard.dismiss();
    const validation = validator.isValidData(
      {
        avatar: avatar_url,
        firstname: firstname,
        lastname: lastname,
      }
    );
    if (!validation.valid) {
      showCustomToast(LABELS.error, validation.message);
      return;
    }
    updateState({ loading: true });
    try {
      const payload = { email: email, avatar_url: avatar_url, first_name: firstname, last_name: lastname };
      isUpdateAvatar
        ? await actions.updateProfileDetail(userDetails?.id, payload)
        : await actions.addProfileDetail(payload);
      await setData(constants.USER_DATA, JSON.stringify({ ...userData, ...payload }));
      saveUserData({ ...userData, ...payload });
      updateState({ isUpdateAvatar: true });
      showCustomToast(LABELS.success, 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.log('Profile Upload Failed: ' + error.message);
      showCustomToast(LABELS.error, 'Profile Upload Failed: ' + error.message);
    } finally {
      updateState({ loading: false });
    }
  }

  const onMenuPress = () => {
    updateState({ listActionModalVisible: true })
  }

  const handleInviteFriendPress = async () => {
    updateState({ listActionModalVisible: false });
    setTimeout(async () => {
      await inviteFriend();
    }, 100);
  }

  const handleImportGoodreadsListPress = () => {
    updateState({ listActionModalVisible: false, importGoodreadsModalVisible: true });
  }

  const handleSendFeedbackPress = () => {
    updateState({ listActionModalVisible: false, feedbackModalVisible: true });
  }

  const handleDeleteAccountPress = () => {
    updateState({ listActionModalVisible: false, deleteAccountModalVisible: true });
    // Alert.alert(
    //   MISC.deleteAccount,
    //   VALIDATIONS.areYouSureWantToDelete,
    //   [{ text: BUTTONS.yes, onPress: {} }, { text: BUTTONS.no, }],
    //   { cancelable: true }
    // )
  }

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

  const handleFeedbackSubmit = async () => {
    if (!feedbackText) {
      showCustomToast(LABELS.error, 'Please enter your feedback');
      return;
    }
    updateState({ feedbackModalVisible: false, loading: true });
    try {
      await actions.sendFeedback({ version: appVersion, feedback: feedbackText });
      showCustomToast(LABELS.success, 'Feedback sent successfully');
      updateState({ feedbackText: '' });
    } catch (error) {
      console.log('Feedback submission failed:', error.message);
      showCustomToast(LABELS.error, 'Feedback submission failed: ' + error.message);
    } finally {
      updateState({ loading: false });
    }
  }

  const handleDeleteConfirm = async () => {

    updateState({ deleteAccountModalVisible: false, loading: true });
    try {
      await actions.deleteAccount({ user_id: userData?.user?.id });
      actions.logout();
      showCustomToast(LABELS.success, 'Account deleted successfully');
    } catch (error) {
      console.log('Feedback submission failed:', error.message);
      showCustomToast(LABELS.error, 'Feedback submission failed: ' + error.message);
    } finally {
      updateState({ loading: false });
    }
  }

  const handleImportGoodreadsSubmit = async (file) => {

    updateState({ importGoodreadsModalVisible: false, loading: true });
    try {
      const formData = new FormData();

      // Append file (must use correct fields)
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'text/csv', // fallback type
        name: file.name || 'upload.csv',
      });
      formData.append('user_id', userData?.user?.id);
      const res = await actions.importGoodreadsListFile(formData);
      console.log('File import res', res);
      showCustomToast(LABELS.success, res.message);
    } catch (error) {
      console.log('File import failed:', error.message);
      showCustomToast(LABELS.error, 'File import failed: ' + error.message);
    } finally {
      updateState({ loading: false });
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Loader modalVisible={loading} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
        style={{ flex: 1 }}
      >
        <Header
          title={ROUTES.profileScreen}
          // rightText={"Save"} 
          // onRightPress={handleSavePress}
          isBack
          onMenuPress={onMenuPress} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled">
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

              {/* First name */}
              <CustomInput
                label={LABELS.firstname}
                value={firstname}
                // editable={false}
                // backgroundColor={COLORS.lighterGray}
                onChangeText={(val) => updateState({ firstname: val.replace(/[^A-Za-z]/g, '') })}
                placeholder={LABELS.firstname}
                maxLength={15}
                mainViewProps={{ marginTop: 24 }}
              />

              {/* Last name */}
              <CustomInput
                label={LABELS.lastname}
                value={lastname}
                // editable={false}
                // backgroundColor={COLORS.lighterGray}
                onChangeText={(val) => updateState({ lastname: val.replace(/[^A-Za-z]/g, '') })}
                placeholder={LABELS.lastname}
                maxLength={15}
                mainViewProps={{ marginTop: 24 }}
              />

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
                title={BUTTONS.save}
                onPress={handleSavePress}
                style={styles.save}
                textStyle={styles.saveText}
              />

              {loading && (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color={COLORS.accent} />
                  <Text style={styles.loadingText}>{VALIDATIONS.signupLoaderText}</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
        {/* Image Picker Modal */}
        <ImageSelectionModal
          modalVisible={modalVisible}
          setModalVisible={(val) => updateState({ modalVisible: val })}
          onImageSelected={onImageSelectedHandler}
        />

        {/* Feedback Modal */}
        <ImportGoodreadPopupModal
          // title={TITLES.feedback}
          // subTitle={TITLES.feedbackSubTitle}
          modalVisible={importGoodreadsModalVisible}
          setModalVisible={(val) => updateState({ importGoodreadsModalVisible: false })}
          onCancel={() => updateState({ importGoodreadsModalVisible: false })}
          onSubmit={handleImportGoodreadsSubmit}
        />

        {/* Feedback Modal */}
        <FeedbackPopupModal
          title={TITLES.feedback}
          subTitle={TITLES.feedbackSubTitle}
          modalVisible={feedbackModalVisible}
          setModalVisible={(val) => updateState({ feedbackModalVisible: false })}
          onCancel={() => updateState({ feedbackModalVisible: false })}
          onSubmit={handleFeedbackSubmit}
          isReasonInputRequire={true}
          appVersion={appVersion}
          textInputProps={{
            height: 100,
            onChangeText: (text) => updateState({ feedbackText: text }),
          }}
        />
        {/* Delete Account Modal */}
        <DeleteAccountPopupModal
          title={BUTTONS.deleteAccount}
          subTitle={VALIDATIONS.areYouSureWantToDelete}
          modalVisible={deleteAccountModalVisible}
          setModalVisible={(val) => updateState({ deleteAccountModalVisible: val })}
          onCancel={() => updateState({ deleteAccountModalVisible: false })}
          onSubmit={handleDeleteConfirm}
          isReasonInputRequire={true}
        // textInputProps={{
        //   // height: 100,
        //   onChangeText: (text) => updateState({ deleteReasonText: text }),
        // }}
        />
        {/* List Popup Modal */}
        <ProfileListPopupModal
          selectedItem={selectedActionItem}
          modalVisible={listActionModalVisible}
          setModalVisible={(val) => updateState({ listActionModalVisible: val })}
          onInviteFriend={handleInviteFriendPress}
          onImportGoodreadsList={handleImportGoodreadsListPress}
          onSendFeedback={handleSendFeedbackPress}
          onDeleteAccount={handleDeleteAccountPress}
          onLogout={handleLogout}
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
    flex: 1,
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
  save: {
    backgroundColor: COLORS.green,
  },
  saveText: {
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
