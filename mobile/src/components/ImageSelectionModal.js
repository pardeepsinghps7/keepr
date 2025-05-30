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
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import COLORS from '../constants/colors';
import imagesPath from '../constants/images';
import Icon from 'react-native-vector-icons/Ionicons';
import actions from '../redux/actions';
import { showCustomToast } from '../utils/helpers';
import { STRINGS } from '../constants/strings';

const screenWidth = Dimensions.get('window').width;
const horizontalPadding = 48;
const totalSpacing = 10 * 2;
const avatarItemSize = (screenWidth - horizontalPadding - totalSpacing) / 3;

const AVATARS = [
  { id: '1', src: imagesPath.avatar1 },
  { id: '2', src: imagesPath.avatar2 },
  { id: '3', src: imagesPath.avatar3 },
  { id: '4', src: imagesPath.avatar4 },
  { id: '5', src: imagesPath.avatar5 },
  { id: '6', src: imagesPath.avatar6 },
  { id: '7', src: imagesPath.avatar7 },
  { id: '8', src: imagesPath.avatar8 },
];

const ImageSelectionModal = ({ modalVisible, setModalVisible, onImageSelected }) => {
  const { LABELS, } = STRINGS;
  const [selectedOption, setSelectedOption] = useState('image');
  const [state, setState] = useState({
    loading: false,
    listIcon: [],
  });

  const updateState = (data) => setState((prev) => ({ ...prev, ...data }));

  const {
    loading, listIcon,
  } = state;

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    updateState({ loading: true });
    try {
      const response = await actions.getAvatarsList();
      updateState({ listIcon: response });
      console.log('getAvatarsList response', response);
    } catch (error) {
      console.log('getAvatarsList failed Api:', error.message);
      showCustomToast(LABELS.error, error.message);
    } finally {
      updateState({ loading: false });
    }
  }

  const handleImageSelection = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo' });
      if (result.assets && result.assets.length > 0) {
        onImageSelected(result.assets[0].uri, false);
        setModalVisible(false);
      }
    } catch (error) {
      console.log('Image selection error:', error);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const result = await launchCamera({ mediaType: 'photo' });
      if (result.assets && result.assets.length > 0) {
        onImageSelected(result.assets[0].uri, false);
        setModalVisible(false);
      }
    } catch (error) {
      console.log('Camera capture error:', error);
    }
  };

  const handleAvatarPress = (uri) => {
    // const uri = Image.resolveAssetSource(avatarSrc).uri;
    onImageSelected(uri, true);
    setModalVisible(false);
  };

  const renderAvatarItem = ({ item }) => (
    <TouchableOpacity style={styles.avatarItem} onPress={() => handleAvatarPress(item?.path)}>
      <Image source={{ uri: item?.path }} style={styles.avatarImage} />
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
          {/* Tabs */}
          <View style={styles.modalTabs}>
            <TouchableOpacity
              style={[styles.modalTab, selectedOption === 'image' && styles.selectedTab]}
              onPress={() => setSelectedOption('image')}
            >
              <Image source={imagesPath.cloudPlus} style={styles.image} />
              <Text style={styles.modalTabText}>Upload</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalTab, selectedOption === 'avatar' && styles.selectedTab]}
              onPress={() => setSelectedOption('avatar')}
            >
              <Image source={imagesPath.avatarSample} style={styles.sampleImage} />
              <Text style={styles.modalTabText}>Avatar</Text>
            </TouchableOpacity>
          </View>

          {/* Conditional content */}
          {selectedOption === 'image' ? (
            <>
              <TouchableOpacity style={styles.modalButton} onPress={handleImageSelection}>
                <View style={styles.cameraContainer}>
                  <Image source={imagesPath.gallery} style={styles.cameraImage} />
                </View>
                <Text style={styles.modalButtonText}>Choose from library</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalButton} onPress={handleCameraCapture}>
                <View style={styles.cameraContainer}>
                  <Image source={imagesPath.camera} style={styles.cameraImage} />
                </View>
                <Text style={styles.modalButtonText}>Take photo</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={{ maxHeight: 350 }}>
              <FlatList
                data={listIcon}
                numColumns={3}
                keyExtractor={(item) => item.id}
                renderItem={renderAvatarItem}
                contentContainerStyle={styles.avatarList}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}

          {/* Go Back */}
          <TouchableOpacity style={styles.goBack} onPress={() => setModalVisible(false)}>
            <Icon name="arrow-back" size={16} color={COLORS.accent} />
            <Text style={[styles.modalButtonText, { color: COLORS.accent }]}>
              Go back
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
  modalTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 8,
    gap: 8,
  },
  modalTab: {
    flex: 1 / 2,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedTab: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
  },
  modalTabText: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.black,
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
    borderRadius: 48
  },
});

export default ImageSelectionModal;
