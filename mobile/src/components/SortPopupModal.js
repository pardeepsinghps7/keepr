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
  TouchableWithoutFeedback,
} from 'react-native';
import COLORS from '../constants/colors';
import imagesPath from '../constants/images';
import Icon from 'react-native-vector-icons/Ionicons';
import { STRINGS } from '../constants/strings';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const screenWidth = Dimensions.get('window').width;
const horizontalPadding = 48;
const totalSpacing = 10 * 2;
const avatarItemSize = (screenWidth - horizontalPadding - totalSpacing) / 3;

const SortPopupModal = ({ statusList, modalVisible, setModalVisible, selectedItem, onSelectItem }) => {
  const { MISC, LABELS } = STRINGS

  return (
    <Modal
      animationType="slide"
      transparent
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.headerIndicator} />
            <Text style={styles.cardTitle}>{MISC.sortBy}</Text>

            {/* Conditional content */}

            <TouchableOpacity style={styles.modalButton} onPress={() => onSelectItem(MISC.sortDate)}>
              <View style={styles.cameraContainer}>
                <Image source={imagesPath.calender} style={styles.cameraImage} />
              </View>
              <Text style={styles.modalButtonText}>{MISC.dateAdded}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={() => onSelectItem(MISC.sortRating)}>
              <View style={styles.cameraContainer}>
                <SimpleLineIcons name={'star'} size={20} color={COLORS.black} />
              </View>
              <Text style={styles.modalButtonText}>{MISC.ratingHighLow}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={() => onSelectItem(MISC.sortTitle)}>
              <View style={styles.cameraContainer}>
                <Icon name="filter" size={20} color={COLORS.black} />
              </View>
              <Text style={styles.modalButtonText}>{MISC.titleAtoZ}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={() => onSelectItem(MISC.sortStatus)}>
              <View style={styles.cameraContainer}>
                <Image source={imagesPath.sortStatus} style={styles.cameraImage} />
              </View>
              <Text style={styles.modalButtonText}>
                {`${MISC.status}${statusList.length > 0 ? ` (${statusList[0]?.label} → ${statusList[1]?.label})` : ''}`}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={() => onSelectItem(MISC.sortSaveForLater)}>
              <View style={styles.cameraContainer}>
                <Image source={imagesPath.sortFavorite} style={styles.cameraImage} />
              </View>
              <Text style={styles.modalButtonText}>{LABELS.savedForLater}</Text>
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
      </TouchableWithoutFeedback>
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: COLORS.black,
    marginBottom: 20,
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
    resizeMode: 'contain'
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

export default SortPopupModal;
