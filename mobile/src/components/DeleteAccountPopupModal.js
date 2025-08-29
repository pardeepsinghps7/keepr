import React, { useCallback, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import COLORS from '../constants/colors';
import imagesPath from '../constants/images';
import Icon from 'react-native-vector-icons/Ionicons';
import { STRINGS } from '../constants/strings';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import { showCustomToast } from '../utils/helpers';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const horizontalPadding = 48;
const totalSpacing = 10 * 2;
const avatarItemSize = (screenWidth - horizontalPadding - totalSpacing) / 3;

const DeleteAccountPopupModal = ({
  modalVisible,
  setModalVisible,
  textInputProps,
  isReasonInputRequire = false,
  title = "Feedback",
  subTitle = "We value your feedback",
  onCancel,
  onSubmit,
}) => {
  const { LABELS, BUTTONS } = STRINGS
  const [state, setState] = useState({
    isReasonNotRight: false,
    reason: ''
  });
  const { isReasonNotRight, reason } = state;
  const updateState = (data) => setState((prev) => ({ ...prev, ...data }));
  const CloseIconComponent = () => {
    return (
      <TouchableOpacity
        style={{ position: 'absolute', right: 8, top: 8 }}
        onPress={onCancel}
      >
        <Icon
          name={'close-circle-sharp'}
          size={24}
          color={COLORS.black}
        />
      </TouchableOpacity>
    )
  }

  useFocusEffect(
    useCallback(() => {
      // ✅ Reset form state when screen is focused
      updateState({
        isReasonNotRight: false,
        reason: '',
      });
    }, [])
  );

  return (
    <Modal
      animationType="slide"
      transparent
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
      onTouchCancel={true}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* <View style={styles.headerIndicator} /> */}
            <CloseIconComponent />
            <View style={{ alignItems: 'center', width: '100%', flexGrow: 1 }}>
              {/* <Image source={image}
              style={styles.imageStyle}
            /> */}
              <Text style={styles.titleTextStyle}>{title}</Text>
              <Text style={styles.subTitleTextStyle}>
                {subTitle}
              </Text>

              <Text style={styles.subTitleTextStyle}>
                Type "YES" to Confirm Permanent Account Deletion
              </Text>


              {isReasonInputRequire &&
                <CustomInput
                  placeholder={LABELS.addDescription}
                  style={{ width: '100%' }}
                  isRequired={true}
                  onChangeText={(text) => {
                    updateState({ isReasonNotRight: false, reason: text });
                  }}
                  // multiline={true}
                  textAlignVertical="top"
                  // numberOfLines={5}
                  // maxLength={200}
                  textInputProps={{ fontSize: 14, }}
                  inputContainerStyle={{ paddingVertical: 8 }}
                  {...textInputProps}
                />
              }

            </View>
            {isReasonNotRight && <Text style={[styles.subTitleTextStyle, { color: COLORS.red, fontSize: 12 }]}>
              Please type "YES" to confirm permanent account deletion
            </Text>}

            <CustomButton
              title={BUTTONS.deleteAccount}
              onPress={() => {
                console.log("Delete Reason Text: ", reason);
                if (!reason || reason.trim().toLowerCase() !== 'yes') {
                  updateState({ isReasonNotRight: true });
                } else {
                  // showCustomToast(LABELS.error, "Fine");
                  onSubmit();
                }
              }}
              style={{ width: '100%', backgroundColor: COLORS.red }}
              textStyle={{ color: COLORS.white }}
            />


            {/* Go Back */}
            {/* <TouchableOpacity style={styles.goBack} onPress={() => setModalVisible(false)}>
            <Text style={[styles.modalButtonText, { color: COLORS.accent }]}>
              ✕  Cancel
            </Text>
          </TouchableOpacity> */}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    // backgroundColor: '#000000aa',
    backgroundColor: 'rgba(0,0,0,0.5)',
    // justifyContent: 'flex-end',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    // padding: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,

    // backgroundColor: 'white',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headerIndicator: {
    alignSelf: 'center',
    width: 40,
    height: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginBottom: 16,
  },
  cardItems: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightBg,
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    gap: 16,
  },
  titleTextStyle: { fontSize: 22, color: COLORS.black },
  subTitleTextStyle: {
    fontSize: 14,
    color: COLORS.text_secondary,
    marginVertical: 8,
    textAlign: 'center'
  },
  iconImageStyle: {
    width: 28,
    height: 28,
    resizeMode: 'contain'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: COLORS.text_secondary
  },
  itemCount: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.text_secondary
  },
  modalButton: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  goBack: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.primary,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 16,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.black,
  },
  cameraContainer: {
    backgroundColor: COLORS.secondary,
    width: 32,
    height: 32,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraImage: {
    width: 20,
    height: 20,
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  sampleImage: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  avatarList: {
    marginTop: 10,
  },
  avatarItem: {
    width: avatarItemSize,
    height: avatarItemSize / 1.4,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 5,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 84,
    height: 84,
    resizeMode: 'cover',
  },
});

export default DeleteAccountPopupModal;
