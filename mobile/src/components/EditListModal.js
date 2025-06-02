import React, { useEffect, useState } from 'react';
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
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import actions from '../redux/actions';

const screenWidth = Dimensions.get('window').width;
const horizontalPadding = 48;
const totalSpacing = 10 * 2;
const avatarItemSize = (screenWidth - horizontalPadding - totalSpacing) / 3;

const AVATARS = [
  { id: '1', src: imagesPath.list_icon1 },
  { id: '2', src: imagesPath.list_icon2 },
  { id: '3', src: imagesPath.list_icon3 },
  { id: '4', src: imagesPath.list_icon4 },
  { id: '5', src: imagesPath.list_icon5 },
  { id: '6', src: imagesPath.list_icon6 },
  { id: '7', src: imagesPath.list_icon7 },
];

const EditListModal = ({ data, modalVisible, setModalVisible, selectedItem, onSave }) => {
  const { LABELS, BUTTONS, MISC } = STRINGS
  const [state, setState] = useState({
    loading: false,
    listName: '',
    selectedIcon: {},
    listIcon: [],
  });

  const updateState = (data) => setState((prev) => ({ ...prev, ...data }));

  const {
    loading,
    listIcon,
    listName,
    selectedIcon,
  } = state;

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    updateState({ loading: true });
    try {
      const response = await actions.getIconsList();
      let index = response.findIndex(item => {
        // console.log('edit list index', item?.path, data?.icon, item?.path === data?.icon)
        return item?.path === data?.icon
      });
 
      // If not found, fallback to 0
      if (index === -1) index = 0;
      updateState({ listIcon: response, selectedIcon: response[index] || {}, listName: data?.label || 'kuttt'});
      console.log('Icon List response', response);
    } catch (error) {
      console.log('Icon List failed Api:', error.message);
      showCustomToast(LABELS.error, error.message);
    } finally {
      updateState({ loading: false });
    }
  }

  const renderAvatarItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.cameraContainer,
        { backgroundColor: selectedIcon.id === item.id ? COLORS.primary : COLORS.lightBg }
      ]}
      onPress={() => updateState({ selectedIcon: item })} >
      <Image source={{ uri: item?.path }} style={styles.cameraImage} />
    </TouchableOpacity>
  );

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

          <Text style={styles.cardTitle}>{MISC.editList}</Text>

          {/* List Name Input */}
          <CustomInput
            placeholder={LABELS.listNamePlaceholder}
            value={listName}
            onChangeText={(val) => updateState({ listName: val.replace(/[^A-Za-z0-9 ]/g, '') })}
            label={LABELS.listName}
            mainViewProps={{ marginBottom: 16 }}
          />
          {/* Select Icon */}
          <Text style={styles.inputLabel}>{LABELS.selectIcon}</Text>
          <FlatList
            data={listIcon}
            keyExtractor={(item) => item.id}
            renderItem={renderAvatarItem}
            contentContainerStyle={styles.avatarList}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            horizontal
          />

          <CustomButton
            title={BUTTONS.updateList}
            style={{
              // backgroundColor: listName.trim() ? COLORS.primary : COLORS.lightBg
            }}
            onPress={() => {
              if (listName.trim()) {
                onSave({
                  id: selectedIcon?.id, // simple unique id
                  label: listName.trim(),
                  icon: selectedIcon?.path,
                });
                // updateState({ listName: '', selectedIcon: listIcon[0] }); // Reset
                setModalVisible(false);
              }
            }}
          />
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: COLORS.black,
    marginBottom: 20,
  },
  itemCount: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.text_secondary
  },
  goBack: {
    // borderWidth: 1,
    borderRadius: 8,
    // borderColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.black,
  },
  cameraContainer: {
    backgroundColor: COLORS.lightBg,
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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
    gap: 10
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

export default EditListModal;
