import React, { useCallback, useEffect, useState } from 'react';
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
import { pickCsvFile } from '../utils/helpers';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const horizontalPadding = 48;
const totalSpacing = 10 * 2;
const avatarItemSize = (screenWidth - horizontalPadding - totalSpacing) / 3;

const ImportGoodreadPopupModal = ({
  modalVisible,
  setModalVisible,
  title = "Goodreads Import",
  subTitle = "Only .CSV file is accepted",
  onCancel,
  onSubmit,
}) => {
  const { LABELS, BUTTONS } = STRINGS
  const [state, setState] = useState({
    file: null,
  });
  const { file } = state;
  const updateState = (data) => setState((prev) => ({ ...prev, ...data }));

  useFocusEffect(
    useCallback(() => {
      // ✅ Reset form state when screen is focused
      updateState({
        file: null,
      });
    }, [])
  );

  const CloseIconComponent = () => {
    return (
      <TouchableOpacity
        style={{ position: 'absolute', right: 8, top: 8 }}
        onPress={() => {
          onCancel();

          updateState({ file: null });
        }}
      >
        <Icon
          name={'close-circle-sharp'}
          size={24}
          color={COLORS.black}
        />
      </TouchableOpacity>
    )
  }

  const handlePickCsv = async () => {
    const file = await pickCsvFile();
    if (file) {
      updateState({ file: file }); // store selected file in state
      console.log("CSV File Picked:", file);
      // file.uri → path to file
      // file.name → file name
      // file.size → file size
      // file.type → mime type
    }
  };

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
              <TouchableOpacity
                style={styles.uploadContainer}
                onPress={handlePickCsv}
              >
                {!file ? <Icon
                  name={'cloud-upload-outline'}
                  size={80}
                  color={COLORS.borderGray}
                /> :
                  <>
                    <Text style={styles.fileName}>📂 {file.name}</Text>
                    <Text style={styles.fileSize}>{(file.size / 1024).toFixed(2)} KB</Text>
                    <Text style={styles.changeText}>Tap to change file</Text>
                  </>}
              </TouchableOpacity>
            </View>

            <CustomButton
              title={BUTTONS.submit}
              onPress={()=>{
                onSubmit(file);
                updateState({ file: null });
              }}
              style={{ width: '100%' }}
            />
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
  uploadContainer: {
    borderWidth: 1,
    width: '100%',
    padding: 16,
    borderRadius: 8,
    borderColor: COLORS.borderGray,
    alignItems: 'center',
    marginVertical: 16,
  },
  fileName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
  },
  changeText: {
    fontSize: 12,
    color: '#4A90E2',
  },
});

export default ImportGoodreadPopupModal;
