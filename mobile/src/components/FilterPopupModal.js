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
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { STRINGS } from '../constants/strings';
import CustomButton from './CustomButton';

const screenWidth = Dimensions.get('window').width;
const horizontalPadding = 48;
const totalSpacing = 10 * 2;
const avatarItemSize = (screenWidth - horizontalPadding - totalSpacing) / 3;

const FilterPopupModal = ({ modalVisible, setModalVisible, selectedItem, onView, onSave }) => {
  const { MISC, LABELS, BUTTONS } = STRINGS

  const [saveForLater, setSaveForLater] = useState(false);
  const [rating, setRating] = useState(0);
  const [open, setOpen] = useState(false);
  const [statusList, setStatusList] = useState([
    { key: 'watched', label: 'Watched' },
    { key: 'to_watch', label: 'To Watch' }
  ]);
  const [status, setStatus] = useState(statusList[0]);

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
          <Text style={styles.cardTitle}>{MISC.filterBy}</Text>

          {/* Conditional content */}
          <TouchableOpacity onPress={() => setSaveForLater(!saveForLater)} style={styles.checkboxContainer}>
            <Ionicons
              name={saveForLater ? 'checkbox-outline' : 'square-outline'}
              size={24}
              color={saveForLater ? COLORS.black : COLORS.borderGray}
            />
            <Text style={styles.checkboxLabel}>Save for Later</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Status</Text>
          <View style={styles.radioGroup}>
            {statusList
              .map((item) => (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => setStatus(item)}
                  style={styles.radioButton}
                >
                  <View style={styles.radioCircle(status.key === item.key)} />
                  <Text style={styles.radioLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
          </View>

          {status.key === 'watched' && <>
            <Text style={styles.label}>Rating</Text>
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((i) => (
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                  {i <= rating ? <Octicons
                    name={'star-fill'}
                    size={23}
                    color={COLORS.black}
                    style={{ marginRight: 8 }}
                  /> : <SimpleLineIcons
                    name={'star'}
                    size={20}
                    color={COLORS.black}
                    style={{ marginRight: 8 }}
                  />}
                </TouchableOpacity>
              ))}
            </View>
          </>}

          <CustomButton
            title={BUTTONS.applyFilters}
            onPress={() => {
              const value = `&status=eq.${status.key}&rating=gte.${status.key === MISC.filterToWatch ? 0 : rating}`;
              onSave({
                value,
                saveForLater,
              });
              setRating(0);
              setSaveForLater(false);
              setStatus(statusList[0]);
              setModalVisible(false);
            }}
          />

          {/* Go Back */}
          <TouchableOpacity style={styles.goBack} onPress={() => {
            setRating(0);
            setSaveForLater(false);
            setStatus(statusList[0]);
            setModalVisible(false);
          }}>
            {/* <Icon name="arrow-back" size={16} color={COLORS.accent} /> */}
            <Text style={[styles.modalButtonText, { color: COLORS.accent }]}>
              {BUTTONS.clearFilters}
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
    marginBottom: 16,
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
  label: { fontWeight: '400', marginBottom: 16, fontSize: 16, color: COLORS.black, },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: { marginLeft: 8, fontSize: 16, fontWeight: '400', color: COLORS.black },
  radioGroup: { flexDirection: 'column', marginBottom: 16, gap: 16 },
  radioCircle: (isSelected) => ({
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: isSelected ? 4 : 2,
    borderColor: isSelected ? COLORS.primary : COLORS.borderGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  }),
  radioButton: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  radioLabel: { marginLeft: 6, fontWeight: '400', fontSize: 16, color: COLORS.black },
  starContainer: { flexDirection: 'row', marginBottom: 16 },
});

export default FilterPopupModal;
