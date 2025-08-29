import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import COLORS from '../constants/colors';
import imagesPath from '../constants/images';
import Icon from 'react-native-vector-icons/Ionicons';
import { STRINGS } from '../constants/strings';

const screenWidth = Dimensions.get('window').width;
const horizontalPadding = 48;
const totalSpacing = 10 * 2;
const avatarItemSize = (screenWidth - horizontalPadding - totalSpacing) / 3;

const ProfileListPopupModal = ({
  modalVisible,
  setModalVisible,
  selectedItem,
  onInviteFriend,
  onImportGoodreadsList,
  onSendFeedback,
  onDeleteAccount,
  onLogout,
  editText,
  deleteText
}) => {
  const { MISC, BUTTONS } = STRINGS

  return (
    <Modal
      animationType="slide"
      transparent
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.headerIndicator} />

          <TouchableOpacity style={styles.modalButton} onPress={onInviteFriend}>
            <View style={styles.cameraContainer}>
              <Image source={imagesPath.invite_friend} style={styles.cameraImage} />
            </View>
            <Text style={styles.modalButtonText}>{BUTTONS.inviteFriend}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalButton} onPress={onImportGoodreadsList}>
            <View style={styles.cameraContainer}>
              <Image source={imagesPath.import_list} style={styles.cameraImage} />
            </View>
            <Text style={styles.modalButtonText}>{BUTTONS.importGoodreadsList}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalButton} onPress={onSendFeedback}>
            <View style={styles.cameraContainer}>
              <Image source={imagesPath.feedback} style={styles.cameraImage} />
            </View>
            <Text style={styles.modalButtonText}>{BUTTONS.sendFeedback}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalButton} onPress={onDeleteAccount}>
            <View style={[styles.cameraContainer, { backgroundColor: COLORS.red10 }]}>
              <Image source={imagesPath.delete} style={styles.cameraImage} />
            </View>
            <Text style={[styles.modalButtonText, { color: COLORS.red }]}>{BUTTONS.deleteAccount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalButton} onPress={onLogout}>
            <View style={[styles.cameraContainer, { backgroundColor: COLORS.red10 }]}>
              <Image source={imagesPath.logout} style={[styles.cameraImage,{tintColor:COLORS.red}]} />
            </View>
            <Text style={[styles.modalButtonText, { color: COLORS.red }]}>{BUTTONS.logout}</Text>
          </TouchableOpacity>


          {/* Go Back */}
          <TouchableOpacity style={styles.goBack} onPress={() => setModalVisible(false)}>
            {/* <Icon name="arrow-back" size={16} color={COLORS.accent} /> */}
            <Text style={[styles.modalButtonText, { color: COLORS.accent }]}>
              ✕  Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    resizeMode: 'contain',
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

export default ProfileListPopupModal;
