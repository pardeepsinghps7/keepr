import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import COLORS from '../../constants/colors';
import CustomInput from '../../components/CustomInput';
import { STRINGS } from '../../constants/strings';
import CustomButton from '../../components/CustomButton';
import actions from '../../redux/actions';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Loader from '../../components/Loader';
import validator from '../../utils/validators';
import { getStatusList, showCustomToast } from '../../utils/helpers';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageModal from '../../components/ImageModal';
import { uploadAvatarToSupabase } from '../../lib/supabase';
import { useSelector } from 'react-redux';
// import { FontAwesome } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const QuickAddItemScreen = ({ navigation }) => {
  const { LABELS, BUTTONS, MISC } = STRINGS
  const userData = useSelector((state) => state.auth.userData);
  const isFocused = useIsFocused();
  const [saveForLater, setSaveForLater] = useState(false);
  const [rating, setRating] = useState(0);
  const [open, setOpen] = useState(false);
  const [podcastList, setPodcastList] = useState([
    { key: MISC.filterSeries, label: MISC.series },
    { key: MISC.filterEpisode, label: MISC.episode }
  ]);
  // To debounce API calls:
  const debounceTimeout = useRef(null);
  // const [statusList, setStatusList] = useState(movieStatusList);
  // const [status, setStatus] = useState(statusList[0]);
  // const [value, setValue] = useState(items[0].value);

  const [state, setState] = useState({
    title: '',
    recommendedBy: '',
    notes: '',
    dataList: [],
    loading: '',
    selectedListId: '',
    selectedListLabel: '',
    author: '',
    statusList: [],
    status: {},
    value: {},
    year: '',
    imageUrl: '',
    location: '',
    brewery: '',
    podcastType: podcastList[0],
    searchList: [],
    showDropdown: false,
    seriesTitle: '',
    episodeTitle: '',
    imageModalVisible: false,
    imageLoading: false,
  });

  const {
    title, seriesTitle, episodeTitle, recommendedBy, notes, dataList,
    loading, selectedListId, selectedListLabel, location, brewery,
    author, statusList, status, value, year, imageUrl, podcastType,
    searchList, showDropdown, imageModalVisible, imageLoading,
  } = state;

  const updateState = (data) => setState((prev) => ({ ...prev, ...data }));
  const resetPayloads = {
    // ✅ Reset all form fields here
    title: '',
    recommendedBy: '',
    notes: '',
    author: '',
    rating: 0,
    seriesTitle: '',
    episodeTitle: '',
    imageUrl: '',
    location: '',
    brewery: '',
    year: '',
    podcastType: podcastList[0],
    searchList: [],
    showDropdown: false,
    saveForLater: false,
    imageLoading: false,
  }

  useFocusEffect(
    useCallback(() => {
      // ✅ Reset form state when screen is focused
      updateState({
        ...resetPayloads,
      });
    }, [])
  );

  useEffect(() => {
    let isActive = true;
    init(isActive);
    // if (isFocused) {
    //   init(isActive);
    // }
    return () => {
      isActive = false;
    };
  }, []);

  const init = async (isActive) => {
    updateState({ loading: true });
    try {
      const response = await actions.getUserList();
      console.log('getUserList response', response);
      const dropdownItems = response.map(item => ({
        label: item.label,
        value: item.id,
        key: item.id, // ensures unique key
      }));
      const list = getStatusList(dropdownItems[0].label);
      updateState({
        dataList: dropdownItems,
        selectedListId: dropdownItems[0].key,
        selectedListLabel: dropdownItems[0].label,
        value: dropdownItems[0].value,
        statusList: list,
        status: list[0],
      });
      console.log('hey', dropdownItems)
    } catch (error) {
      console.log('getUserList failed:', error.message);
      showCustomToast(LABELS.error, error.message);
    } finally {
      updateState({ loading: false });
    }
  }

  const handleSavePress = async () => {
    Keyboard.dismiss();
    const validation = selectedListLabel.toLowerCase() === MISC.wine
      || selectedListLabel.toLowerCase() === MISC.bourbon
      || selectedListLabel.toLowerCase() === MISC.restaurants
      || selectedListLabel.toLowerCase() === MISC.beer
      ? validator.isValidData(
        {
          name: title,
        }
      )
      : selectedListLabel.toLowerCase() === MISC.podcasts && podcastType.label.toLowerCase() === MISC.episode
        ? validator.isValidData(
          {
            episodeTitle: episodeTitle,
          }
        )
        : selectedListLabel.toLowerCase() === MISC.podcasts && podcastType.label === MISC.series
          ? validator.isValidData(
            {
              seriesTitle: seriesTitle,
            }
          )
          : validator.isValidData(
            {
              title: title,
            }
          );
    if (!validation.valid) {
      showCustomToast(LABELS.error, validation.message);
      return;
    }
    updateState({ loading: true });
    try {
      const payload = {
        list_id: selectedListId,
        title,
        save_for_later: saveForLater,
        recommended_by: recommendedBy,
        notes,
        status: status.key,
        rating: status.id === 0 ? rating : 0,
        author,
        series_title: seriesTitle,
        episode_title: episodeTitle,
        podcast_type: podcastType.key,
        location,
        brewery,
        year,
        image_url: imageUrl,
      };
      const response = await actions.addItem(payload);
      console.log('addItem response:', response);
      navigation.goBack();
      showCustomToast(LABELS.success, MISC.itemAddedSuccessfully);
    } catch (error) {
      console.log('addItem failed:', error.message);
      showCustomToast(LABELS.error, error.message);
    } finally {
      updateState({ loading: false });
    }
  }

  const fetchResults = async (query) => {
    // updateState({ loading: true });
    try {
      const response = selectedListLabel.toLowerCase() === MISC.books
        ? await actions.getSearchBooksList(query)
        : selectedListLabel.toLowerCase() === MISC.movies
          ? await actions.getSearchMoviesList(query)
          : await actions.getSearchMoviesList(query);
      console.log('getSearchBooksList response', response);

      if (response && response.data.length > 0) {
        updateState({
          searchList: response.data,
          showDropdown: true,
        });
      } else {
        updateState({
          searchList: [],
          showDropdown: false,
        });
      }
    } catch (error) {
      console.log('getSearchBooksList failed:', error.message);
      showCustomToast(LABELS.error, error.message);
    } finally {
      // updateState({ loading: false });
    }
  }

  const onChangeText = (text) => {
    updateState({ title: text.replace(/[^A-Za-z0-9 ]/g, '') });

    if (text.length > 3
      && (selectedListLabel.toLowerCase() === MISC.books
        || selectedListLabel.toLowerCase() === MISC.movies)) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

      // Debounce API call by 500ms
      debounceTimeout.current = setTimeout(() => {
        fetchResults(text.trim());
      }, 500);
    }
  };

  const handleSelectTitle = (item) => {
    updateState({ title: item.title, showDropdown: false, searchList: [] });

  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelectTitle(item)}>
      <Text style={styles.label}>{item.title}</Text>
    </TouchableOpacity>
  );

  const onImageSelectedHandler = async (uri) => {
    updateState({ loading: true });
    try {
      const avatarUrl = await uploadAvatarToSupabase(uri, userData?.user?.id);
      if (!avatarUrl?.publicURL) {
        showCustomToast(LABELS.error, 'Failed to get public URL from Supabase');
        return;
      }
      updateState({ imageUrl: avatarUrl.publicURL });

      // showCustomToast(LABELS.success, 'Profile added successfully');
    } catch (error) {
      console.log('Image Upload Failed: ' + error.message);
      showCustomToast(LABELS.error, 'Image Upload Failed: ' + error.message);
    } finally {
      updateState({ loading: false });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 0, flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Loader modalVisible={loading} />
          <View style={styles.headerIndicator} />
          <Text style={styles.header}>Add Quick Item</Text>

          <Text style={styles.label}>Select List Type</Text>

          {/* <DropdownContainer /> */}
          {dataList.length > 0 && <View style={styles.dropdownContainer}>
            <DropDownPicker
              open={open}
              value={value}
              items={dataList}
              setOpen={setOpen}
              onSelectItem={(item) => {
                const list = getStatusList(item.label);
                updateState({
                  selectedListId: item.key,
                  selectedListLabel: item.label,
                  statusList: list,
                  status: list[0],
                  value: item.value,
                })
              }}
              placeholder="Select a category"
              style={styles.dropdown}
              textStyle={{ fontSize: 16, color: COLORS.black }}
              dropDownContainerStyle={styles.dropdownBox}
              listMode="SCROLLVIEW"
            />
          </View>}
          {/* Title Input */}
          {/* <TitleInputField /> */}
          <View style={styles.searchBox}>
            {selectedListLabel.toLowerCase() !== MISC.podcasts && <CustomInput
              placeholder={LABELS.typeSomethingHere}
              value={title}
              mainViewProps={{ marginVertical: 12 }}
              onChangeText={onChangeText}
              keyboardType={'text'}
              // onChangeText={(val) => updateState({ title: val.replace(/[^A-Za-z0-9@. ]/g, '') })}
              label={(selectedListLabel.toLowerCase() === MISC.bourbon
                || selectedListLabel.toLowerCase() === MISC.wine
                || selectedListLabel.toLowerCase() === MISC.restaurants
                || selectedListLabel.toLowerCase() === MISC.beer) ? LABELS.name : LABELS.title}
            />}
            {showDropdown && dataList.length > 0 && (<View style={[styles.listAbsolute,]}>
              <ScrollView horizontal
                contentContainerStyle={{
                  maxHeight: 280, width: SCREEN_WIDTH,
                  flex: 1, flexGrow: 1
                }}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}>
                <FlatList
                  data={searchList}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItem}
                  contentContainerStyle={{ padding: 8, gap: 8 }}
                />
              </ScrollView>
            </View>
            )}
          </View>
          {/* <PodcastsFields /> */}

          {selectedListLabel.toLowerCase() === MISC.podcasts &&
            <>
              <Text style={styles.label}>Podcasts Type</Text>
              <View style={styles.radioGroup}>
                {podcastList
                  .map((item) => (
                    <TouchableOpacity
                      key={item.key}
                      onPress={() => updateState({ podcastType: item })}
                      style={styles.radioButton}
                    >
                      <View style={styles.radioCircle(podcastType.key === item.key)} />
                      <Text style={styles.radioLabel}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
              </View>
              <CustomInput
                placeholder={LABELS.typeSomethingHere}
                value={seriesTitle}
                mainViewProps={{ marginVertical: 12 }}
                onChangeText={(val) => updateState({ seriesTitle: val.replace(/[^A-Za-z0-9 ]/g, '') })}
                label={LABELS.seriesTitle}
                isOptional={podcastType.label === MISC.episode}
              />
              <CustomInput
                placeholder={LABELS.typeSomethingHere}
                value={episodeTitle}
                mainViewProps={{ marginVertical: 12 }}
                onChangeText={(val) => updateState({ episodeTitle: val.replace(/[^A-Za-z0-9 ]/g, '') })}
                label={LABELS.episodeTitle}
                isOptional={podcastType.label === MISC.series}
              />
            </>}

          {selectedListLabel.toLowerCase() === MISC.restaurants &&
            <>
              <CustomInput
                placeholder={LABELS.typeSomethingHere}
                value={location}
                mainViewProps={{ marginVertical: 12 }}
                onChangeText={(val) => updateState({ location: val.replace(/[^A-Za-z0-9 ]/g, '') })}
                label={LABELS.location}
                isOptional={true}
              />
            </>
          }
          {selectedListLabel.toLowerCase() === MISC.beer &&
            <>
              <CustomInput
                placeholder={LABELS.typeSomethingHere}
                value={brewery}
                mainViewProps={{ marginVertical: 12 }}
                onChangeText={(val) => updateState({ brewery: val.replace(/[^A-Za-z0-9 ]/g, '') })}
                label={LABELS.brewery}
                isOptional={true}
              />
            </>
          }

          {(selectedListLabel.toLowerCase() === MISC.bourbon || selectedListLabel.toLowerCase() === MISC.wine) &&
            <>
              <CustomInput
                placeholder={LABELS.typeSomethingHere}
                value={year}
                mainViewProps={{ marginVertical: 12 }}
                onChangeText={(val) => updateState({ year: val.replace(/[^0-9 \-]/g, '') })}
                label={LABELS.year}
                keyboardType={'numeric'}
                maxLength={10}
                isOptional={true}
              />
            </>
          }

          {<TouchableOpacity onPress={() => setSaveForLater(!saveForLater)} style={styles.checkboxContainer}>
            <Ionicons
              name={saveForLater ? 'checkbox-outline' : 'square-outline'}
              size={24}
              color={saveForLater ? COLORS.black : COLORS.borderGray}
            />
            <Text style={styles.checkboxLabel}>Save for Later</Text>
          </TouchableOpacity>}

          {/* Book Author Input */}
          {selectedListLabel.toLowerCase() === MISC.books && <CustomInput
            placeholder={LABELS.recommendedByPlaceholder}
            value={author}
            onChangeText={(val) => updateState({ author: val.replace(/[^A-Za-z0-9 ]/g, '') })}
            label={LABELS.author}
            mainViewProps={{ marginVertical: 12 }}
            isOptional={true}
          />}


          <Text style={styles.label}>Status</Text>
          <View style={styles.radioGroup}>
            {statusList
              .map((item) => (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => updateState({ status: item })}
                  style={styles.radioButton}
                >
                  <View style={styles.radioCircle(status.key === item.key)} />
                  <Text style={styles.radioLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
          </View>

          {status.id === 0 && <>
            <View style={styles.labelContainer}>
              <Text style={styles.inputLabel}>Rating</Text>
              <Text style={styles.optional}>(Optional)</Text>
            </View>
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

          {/* Recommend Input */}
          <CustomInput
            placeholder={LABELS.recommendedByPlaceholder}
            value={recommendedBy}
            onChangeText={(val) => updateState({ recommendedBy: val.replace(/[^A-Za-z0-9 ]/g, '') })}
            label={LABELS.recommendedBy}
            mainViewProps={{ marginVertical: 12 }}
            isOptional={true}
          />

          {/* Recommend Input */}
          <CustomInput
            placeholder={LABELS.typeSomething}
            value={notes}
            isOptional={true}
            mainViewProps={{ marginVertical: 12 }}
            onChangeText={(val) => updateState({ notes: val.replace(/[^A-Za-z0-9@.%#$&*()-_+/ \n]/g, '') })}
            label={LABELS.notes}
            multiline={true}
            textAlignVertical="top"
            numberOfLines={5}
            maxLength={200}
            height={100}
          />
          {(selectedListLabel.toLowerCase() === MISC.bourbon || selectedListLabel.toLowerCase() === MISC.wine) &&
            <>

              <CustomInput
                placeholder={LABELS.enterImageUrl}
                value={imageUrl}
                mainViewProps={{ marginVertical: 12 }}
                onChangeText={(val) => updateState({ imageUrl: val })}
                label={LABELS.imageUrl}
                isOptional={true}
                icon={'cloud-upload-outline'}
                iconPress={() => updateState({ imageModalVisible: true })}
              />
              {imageUrl.length > 0 &&
                <View
                  style={{
                    borderWidth: 0.2, borderColor: COLORS.borderGray,
                    alignSelf: 'center', marginBottom: 16, padding: 8,
                  }}>
                  <View
                    style={{
                    }}>
                    <Image source={{ uri: imageUrl }} style={styles.sampleImage}
                      onLoadStart={() => updateState({ imageLoading: true })}
                      onLoadEnd={() => updateState({ imageLoading: false })} />
                    {imageLoading && (
                      <View style={styles.loaderOverlay}>
                        <ActivityIndicator size="small" color="#000" />
                      </View>
                    )}
                  </View>
                  <TouchableOpacity style={{ position: 'absolute', right: -8, top: -8 }}
                    onPress={() => updateState({ imageUrl: '' })}>
                    <Ionicons name={'close-circle'} size={24} />
                  </TouchableOpacity>

                </View>}
            </>
          }
          <CustomButton
            title={BUTTONS.saveItemToTheList}
            onPress={handleSavePress}
          />

          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>✕  Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Image Picker Modal */}
      <ImageModal
        modalVisible={imageModalVisible}
        setModalVisible={(val) => updateState({ imageModalVisible: val })}
        onImageSelected={onImageSelectedHandler}
      />
    </SafeAreaView>
  );
}

export default QuickAddItemScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 20, paddingBottom: 100 },
  headerIndicator: {
    alignSelf: 'center',
    width: 40,
    height: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginBottom: 16,
  },
  header: { fontSize: 18, fontWeight: '400', color: COLORS.black, marginBottom: 32 },
  label: { fontWeight: '400', marginBottom: 16, fontSize: 16, color: COLORS.black, },
  dropdownContainer: {
    marginTop: 4,
    marginBottom: 12
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
  radioGroup: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
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
  notesInput: { height: 80, textAlignVertical: 'top' },
  cancelButton: { alignItems: 'center', marginBottom: 40 },
  cancelButtonText: { color: COLORS.accent, fontWeight: '400', fontSize: 16 },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 10, marginTop: 4, color: '#777' },
  //label with optional
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  inputLabel: {
    fontWeight: '400',
    fontSize: 16,
    color: COLORS.black,
  },
  optional: { fontStyle: 'normal', fontSize: 14, color: COLORS.text_secondary, },

  //search

  searchBox: {
    // position: 'relative', // container relative for absolute list
    // zIndex: 10, // make sure on top on Android
  },
  listAbsolute: {
    position: "absolute",
    top: 90,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    maxHeight: 350,
    zIndex: 10,
  },
  item: {
    padding: 4,
    borderBottomColor: '#eee',
    // borderBottomWidth: 1,
  },
  sampleImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain'
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
