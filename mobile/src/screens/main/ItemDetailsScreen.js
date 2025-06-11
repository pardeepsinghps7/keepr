import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Keyboard,
  Image,
  Alert,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import COLORS from '../../constants/colors';
import CustomInput from '../../components/CustomInput';
import { ROUTES, STRINGS } from '../../constants/strings';
import CustomButton from '../../components/CustomButton';
import actions from '../../redux/actions';
import { useIsFocused } from '@react-navigation/native';
import Loader from '../../components/Loader';
import validator from '../../utils/validators';
import { showCustomToast } from '../../utils/helpers';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import AddNewListModal from '../../components/AddNewListModal';
import imagesPath from '../../constants/images';
import ListPopupModal from '../../components/ListPopupModal';
import EditListModal from '../../components/EditListModal';
import CustomRatings from '../../components/CustomRatings';
// import { FontAwesome } from '@expo/vector-icons';

const ItemDetailsScreen = ({ navigation, route }) => {
  const { params } = route
  const { item: routeItemData } = params
  console.log('item dertail', routeItemData)
  const { TITLES, LABELS, BUTTONS, VALIDATIONS, MISC } = STRINGS
  const isFocused = useIsFocused();
  const [state, setState] = useState({
    dataList: {},
    loading: '',
    selectedActionItem: '',
    listActionModalVisible: false,
    editListModalVisible: false,
    // saveForLater:routeItemData?.save_for_later || false,
  });

  const {
    dataList, loading, selectedActionItem, listActionModalVisible, editListModalVisible,
  } = state;

  const updateState = (data) => setState((prev) => ({ ...prev, ...data }));

  useEffect(() => {
    let isActive = true;
    if (isFocused) {
      init(isActive);
    }
    return () => {
      isActive = false;
    };
  }, [isFocused]);

  const init = async (isActive) => {
    updateState({ loading: true });
    try {
      const response = await actions.getItemDetailsById(routeItemData?.id);
      console.log('getItemDetailsById response', response);
      // const dropdownItems = response.map(item => ({
      //   label: item.label,
      //   value: item.id,
      //   key: item.id, // ensures unique key
      // }));
      updateState({ dataList: response[0] });
      // console.log('hey', dropdownItems)
      // setValue(dropdownItems[0].value);
    } catch (error) {
      console.log('getItemDetailsById failed:', error.message);
      showCustomToast(LABELS.error, error.message);
    } finally {
      updateState({ loading: false });
    }
  }

  const onMenuPress = () => {
    updateState({ listActionModalVisible: true })
  }

  const onDeletePress = () => {
    Alert.alert(
      MISC.deleteItem,
      VALIDATIONS.areYouSureWantToDelete,
      [{ text: BUTTONS.yes, onPress: deleteSelectedItem }, { text: BUTTONS.no, }],
      { cancelable: true }
    )
  }

  const deleteSelectedItem = async () => {
    updateState({ loading: true, listActionModalVisible: false });
    try {
      const response = await actions.deleteItem(dataList?.id);
      console.log('deleteList response:', response);
      // const updatedList = dataList.filter((cat) => cat.id !== dataList.id);
      // updateState({ listActionModalVisible: false });
      showCustomToast(LABELS.success, MISC.itemDeletedSuccessfully);
      navigation.goBack();
    } catch (error) {
      console.log('deleteList failed:', error.message);
      showCustomToast(LABELS.error, error.message);
    } finally {
      updateState({ loading: false });
    }
  };

  const handleEdit = () => {
    updateState({ listActionModalVisible: false });
    navigation.navigate(ROUTES.editItemScreen, { item: dataList });
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Loader modalVisible={loading} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardShouldPersistTaps="handled"
      >

        <Header title={TITLES.itemDetails} isBack onMenuPress={onMenuPress} />
        <FlatList
          data={[]}
          renderItem={null}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ gap: 16, flexGrow: 1 }}
          ListHeaderComponent={
            <>
              <View style={styles.mainView}>

                <Text style={styles.title}>{dataList?.title || dataList?.episode_title || dataList?.series_title}</Text>
                <View
                  // onPress={() => setSaveForLater(!saveForLater)} 
                  style={styles.checkboxContainer}>
                  <Icon
                    name={dataList?.save_for_later ? 'checkbox-outline' : 'square-outline'}
                    size={24}
                    color={dataList?.save_for_later ? COLORS.black : COLORS.borderGray}
                  />
                  <Text style={styles.checkboxLabel}>Save for Later</Text>
                </View>

                {dataList?.lists?.label?.toLowerCase() === MISC.podcasts && <View style={[styles.card,]}>
                  <Text style={styles.cardTitle}>{LABELS.podcastsType}</Text>
                  <Text style={styles.cardSubTitle}>{dataList?.podcast_type}</Text>
                </View>}

                {dataList?.lists?.label?.toLowerCase() === MISC.restaurants && dataList?.location &&
                  <View style={[styles.card,]}>
                    <Text style={styles.cardTitle}>{LABELS.location}</Text>
                    <Text style={styles.cardSubTitle}>{dataList?.location || 'N/A'}</Text>
                  </View>}
                {(dataList?.lists?.label?.toLowerCase() === MISC.bourbon
                  || dataList?.lists?.label?.toLowerCase() === MISC.wine) &&
                  <View style={[styles.card,]}>
                    <Text style={styles.cardTitle}>{LABELS.year}</Text>
                    <Text style={styles.cardSubTitle}>{dataList?.year || 'N/A'}</Text>
                  </View>}

                {dataList?.lists?.label?.toLowerCase() === MISC.beer && <View style={[styles.card,]}>
                  <Text style={styles.cardTitle}>{LABELS.brewery}</Text>
                  <Text style={styles.cardSubTitle}>{dataList?.brewery || 'N/A'}</Text>
                </View>}
                {dataList?.lists?.label?.toLowerCase() === MISC.books && <View style={[styles.card,]}>
                  <Text style={styles.cardTitle}>{LABELS.author}</Text>
                  <Text style={styles.cardSubTitle}>{dataList?.author || 'N/A'}</Text>
                </View>}

                <View style={styles.row}>
                  <View style={[styles.rowCard,]}>
                    <Text style={styles.cardTitle}>{MISC.categories}</Text>
                    <View style={styles.cardSubTitleCantainer}>
                      <Image style={[styles.iconImageStyle, { tintColor: COLORS.accent, }]} source={{ uri: dataList?.lists?.icon }} />
                      <Text style={styles.cardSubTitle}>{dataList?.lists?.label}</Text>
                    </View>
                  </View>
                  <View style={[styles.rowCard,]}>
                    <Text style={styles.cardTitle}>{MISC.status}</Text>
                    <View style={styles.cardSubTitleCantainer}>
                      <Image style={styles.iconImageStyle} source={imagesPath.watch} />
                      <Text style={styles.cardSubTitle}>{dataList?.status?.replace(/_/g, ' ')}</Text>
                    </View>
                  </View>
                </View>

                {(dataList?.lists?.label?.toLowerCase() === MISC.movies) &&
                  <View style={[styles.card,]}>
                    <Text style={styles.cardTitle}>{LABELS.releaseDate}</Text>
                    <Text style={styles.cardSubTitle}>{dataList?.raw_json?.release_date || 'N/A'}</Text>
                  </View>}

                {dataList?.rating > 0 && <View style={[styles.card,]}>
                  <Text style={styles.cardTitle}>{LABELS.rating}</Text>
                  <CustomRatings list={[1, 2, 3, 4, 5]} rating={dataList?.rating || 0} selectedSize={20} unselectedSize={18} gap={2} isDisable={true} />
                </View>}

                <View style={[styles.card,]}>
                  <Text style={styles.cardTitle}>{LABELS.recommendedBy}</Text>
                  <Text style={styles.cardSubTitle}>{dataList?.recommended_by || 'N/A'}</Text>
                </View>

                <View style={[styles.card,]}>
                  <Text style={styles.cardTitle}>{LABELS.notes}</Text>
                  <Text style={[styles.cardSubTitle, { fontSize: 16, lineHeight: 28 }]}>{dataList?.notes || 'N/A'}</Text>
                </View>
                {(dataList?.lists?.label?.toLowerCase() === MISC.bourbon
                  || dataList?.lists?.label?.toLowerCase() === MISC.wine) &&
                  <View style={[styles.card,]}>
                    <Text style={styles.cardTitle}>{LABELS.imageUrl}</Text>
                    <Text style={[styles.cardSubTitle, {
                      fontSize: 16, lineHeight: 28,
                      textTransform: dataList?.image_url?.length > 0 ? 'lowercase' : 'uppercase'
                    }]}>
                      {dataList?.image_url || 'N/A'}</Text>
                  </View>}
                {/* {dataList?.image_url?.length > 0 && <Image source={{ uri: dataList?.image_url }} style={styles.sampleImage} />} */}

              </View>
            </>
          }
        />
      </KeyboardAvoidingView>
      {/* List Popup Modal */}
      <ListPopupModal
        selectedItem={selectedActionItem}
        modalVisible={listActionModalVisible}
        setModalVisible={(val) => updateState({ listActionModalVisible: val })}
        onEdit={handleEdit}
        onDelete={onDeletePress}
        editText={MISC.editItem}
        deleteText={MISC.deleteItem}
      />

      {/* Edit List Popup Modal */}
      <EditListModal
        selectedItem={selectedActionItem}
        modalVisible={editListModalVisible}
        setModalVisible={(val) => updateState({ editListModalVisible: val })}
      // onSave={handleUpdateList}
      />
    </SafeAreaView>
  );
}

export default ItemDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainView: { padding: 16 },
  headerIndicator: {
    alignSelf: 'center',
    width: 40,
    height: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginBottom: 16,
  },
  header: { fontSize: 18, fontWeight: '400', color: COLORS.black, marginBottom: 32 },
  title: { fontWeight: '700', fontSize: 22, color: COLORS.black, marginBottom: 16, },
  addNewList: { fontWeight: '400', fontSize: 16, color: COLORS.accent, alignSelf: 'flex-end', textDecorationLine: 'underline' },
  dropdownContainer: {
    marginVertical: 4,
  },
  dropdown: {
    borderColor: COLORS.borderGray,
  },
  dropdownBox: {
    borderWidth: 0.5,
    borderColor: COLORS.borderGray,
    paddingVertical: 8
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: { marginLeft: 8, fontSize: 16, fontWeight: '400', color: COLORS.black },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  plus: {
    color: COLORS.accent,
    backgroundColor: COLORS.secondary,
    padding: 4,
    borderRadius: 16,
  },
  addLabel: {
    fontSize: 16,
    marginTop: 12,
    color: COLORS.accent,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    elevation: 5, // Android
    shadowColor: COLORS.accent, // iOS
    shadowOpacity: 0.07,         // Increase opacity for visibility
    shadowOffset: { width: 0, height: 0 }, // Uniform shadow
    shadowRadius: 8,              // More blur for full-area shadow
    position: 'relative',
    gap: 16,
    marginVertical: 16,
    overflow: 'visible',
  },
  rowCard: {
    width: '47%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    elevation: 5, // Android
    shadowColor: COLORS.accent, // iOS
    shadowOpacity: 0.07,         // Increase opacity for visibility
    shadowOffset: { width: 0, height: 0 }, // Uniform shadow
    shadowRadius: 8,              // More blur for full-area shadow
    position: 'relative',
    gap: 16,
    marginVertical: 16,
    overflow: 'visible',
  },
  iconImageStyle: {
    width: 20,
    height: 20,
    resizeMode: 'contain',

  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.black,
  },
  cardSubTitleCantainer: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, width: '80%' },
  cardSubTitle: {
    fontSize: 15,
    fontWeight: '400',
    color: COLORS.text_secondary,
    textTransform: 'capitalize'
  },

  sampleImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain'
  },
});
