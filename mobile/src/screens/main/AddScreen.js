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
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import COLORS from '../../constants/colors';
import CustomInput from '../../components/CustomInput';
import { ROUTES, STRINGS } from '../../constants/strings';
import CustomButton from '../../components/CustomButton';
import actions from '../../redux/actions';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Loader from '../../components/Loader';
import validator from '../../utils/validators';
import { getCurrentLocation, getStatusList, showCustomToast } from '../../utils/helpers';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import AddNewListModal from '../../components/AddNewListModal';
import imagesPath from '../../constants/images';
import ImageModal from '../../components/ImageModal';
import { uploadAvatarToSupabase } from '../../lib/supabase';
import { useSelector } from 'react-redux';
import moment from 'moment';
// import { FontAwesome } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const AddScreen = ({ navigation, route }) => {
  const { params } = route
  // console.log('Add screen', route)
  const userData = useSelector((state) => state.auth.userData);
  const { LABELS, BUTTONS, MISC } = STRINGS
  const isFocused = useIsFocused();
  const [open, setOpen] = useState(false);
  const [podcastList, setPodcastList] = useState([
    { key: MISC.filterSeries, label: MISC.series },
    { key: MISC.filterEpisode, label: MISC.episode }
  ]);
  const scrollRef = useRef(null);
  // To debounce API calls:
  const debounceTimeout = useRef(null);
  // const [status, setStatus] = useState(statusList[0]);
  // const [items, setItems] = useState([
  //   { label: 'Movies', value: 'Movies' },
  //   { label: 'TV Shows', value: 'TV Shows' },
  //   { label: 'Podcasts', value: 'Podcasts' },
  //   { label: 'Restaurant', value: 'Restaurant' },
  //   { label: 'Wine', value: 'Wine' },
  //   { label: 'Bourbon', value: 'Bourbon' },
  // ]);
  // const [value, setValue] = useState(items[0].value);

  const currentYear = moment().year();
  const [state, setState] = useState({
    title: '',
    recommendedBy: '',
    notes: '',
    dataList: [],
    loading: '',
    selectedListId: '',
    selectedItem: {},
    addItemModalVisible: false,
    needListTypeApiCall: false,
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
    searchSeriesList: [],
    showDropdown: false,
    showSeriesDropdown: false,
    seriesTitle: '',
    episodeTitle: '',
    saveForLater: false,
    imageModalVisible: false,
    imageLoading: false,
    clientId: '',
    rating: 0,
    newelyAddedList: {},
    movieReleaseDate: '',
    variety: '',
    winery: '',
    province: '',
    tvShowsType: '',
    language: '',
    genres: '',
    publisher: '',
    currentLocation: {},
  });

  const {
    title, recommendedBy, notes, dataList, loading, selectedListId, selectedItem,
    addItemModalVisible, needListTypeApiCall, seriesTitle, episodeTitle,
    selectedListLabel, location, brewery, rating,
    author, statusList, status, value, year, imageUrl, podcastType,
    searchList, searchSeriesList, showDropdown, showSeriesDropdown, saveForLater, imageModalVisible, imageLoading,
    clientId, newelyAddedList, movieReleaseDate, variety, winery, province,
    tvShowsType, language, genres, publisher, currentLocation
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
    searchSeriesList: [],
    showDropdown: false,
    showSeriesDropdown: false,
    saveForLater: false,
    imageLoading: false,
    clientId: '',
    movieReleaseDate: '',
    variety: '',
    winery: '',
    province: '',
    tvShowsType: '',
    language: '',
    genres: '',
    publisher: '',
  }

  useFocusEffect(
    useCallback(() => {
      // Scroll to top every time screen comes back into focus
      scrollRef.current?.scrollTo({ y: 0, animated: false });

      // ✅ Reset form state when screen is focused
      updateState({
        ...resetPayloads,
      });
      setOpen(false);
    }, [])
  );

  useEffect(() => {
    getLocation();
  }, []);

  // useEffect(() => {
  //   if (params?.item) {
  //     init(true);

  //     // Clear the param after using
  //     navigation.setParams({ item: undefined });
  //   }
  // }, [params?.item]);

  useEffect(() => {
    let isActive = true;
    if (isFocused || needListTypeApiCall) {
      init(isActive);
    }
    return () => {
      isActive = false;
      updateState({ needListTypeApiCall: false });
    };
  }, [isFocused, needListTypeApiCall]);


  const getLocation = async () => {
    try {
      const currentLocationValue = await getCurrentLocation();
      console.log('currentLocation response', currentLocationValue || {});
      updateState({
        currentLocation: currentLocationValue,
      });
    } catch (error) {
      console.log('getUserList failed:', error.message);
      showCustomToast(LABELS.error, 'Enable location permissions in settings to continue.');
    }
  }

  const init = async (isActive) => {
    updateState({ loading: true, });
    try {
      const response = await actions.getUserListWithItemCount();
      console.log('getUserList response', response);
      const dropdownItems = response.map(item => ({
        // icon:item.icon,
        label: item.label,
        value: item.id,
        key: item.id, // ensures unique key
      }));
      let index = dropdownItems.findIndex(item =>
        item?.key === params?.item?.id
        || item?.label === newelyAddedList?.label
      );

      // If not found, fallback to 0
      if (index === -1) index = 0;

      // Only run this logic if dropdownItems[index] exists
      if (dropdownItems[index]) {
        const list = getStatusList(dropdownItems[index]?.label);
        updateState({
          dataList: dropdownItems,
          selectedListId: dropdownItems[index]?.key,
          selectedListLabel: dropdownItems[index]?.label,
          value: dropdownItems[index]?.value,
          statusList: list,
          status: list[0], // Assuming list is not empty
          newelyAddedList: {},

        });
      }
      navigation.setParams({ item: undefined });
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
      : selectedListLabel.toLowerCase() === MISC.podcasts && podcastType.label.toLowerCase() === MISC.episode.toLowerCase()
        ? validator.isValidData(
          {
            episodeTitle: episodeTitle,
          }
        )
        : selectedListLabel.toLowerCase() === MISC.podcasts && podcastType.label.toLowerCase() === MISC.series.toLowerCase()
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
      const rawJson = {
        release_date: movieReleaseDate,
        variety,
        winery,
        province,
        type: tvShowsType,
        language,
        genres,
        publisher,
      };
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
        client_id: clientId,
        raw_json: rawJson,
      };
      console.log('addItem payload:', payload);
      const response = await actions.addItem(payload);
      console.log('addItem response:', response);
      // navigation.goBack();
      navigation.navigate(ROUTES.mainHome, {
        screen: ROUTES.listDetailsScreen,
        params: { item: { id: selectedListId, label: selectedListLabel } }
      })
      showCustomToast(LABELS.success, MISC.itemAddedSuccessfully);
    } catch (error) {
      console.log('addItem failed:', error.message);
      showCustomToast(LABELS.error, error.message);
    } finally {
      updateState({ loading: false });
    }
  }


  const fetchResults = async (query) => {
    console.log('fdfsfs', currentLocation?.latitude, currentLocation?.longitude)
    // updateState({ loading: true });
    // console.log('fetch item client id',item?.client_id);
    try {
      const response = selectedListLabel.toLowerCase() === MISC.books
        ? await actions.getSearchBooksList(query)
        : selectedListLabel.toLowerCase() === MISC.movies
          ? await actions.getSearchMoviesList(query)
          : selectedListLabel.toLowerCase() === MISC.beer
            ? await actions.getSearchBeerList(query)
            : selectedListLabel.toLowerCase() === MISC.tvShows
              ? await actions.getSearchTVShowsList(query)
              : selectedListLabel.toLowerCase() === MISC.restaurants
                ? await actions.getSearchRestaurantsList(query, currentLocation?.latitude, currentLocation?.longitude, 1)
                : selectedListLabel.toLowerCase() === MISC.podcasts
                  ? await actions.getSearchPodcastEpisodeList(query, clientId)
                  : selectedListLabel.toLowerCase() === MISC.bourbon
                    ? await actions.getSearchBourbonsList(query)
                    : await actions.getSearchWinesList(query);
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

  const fetchSeriesResults = async (query) => {
    console.log('fdfsfs', currentLocation?.latitude, currentLocation?.longitude)
    // updateState({ loading: true });
    try {
      const response = await actions.getSearchPodcastsList(query);
      console.log('getSearchPodcastsList response', response);

      if (response && response.data.length > 0) {
        updateState({
          searchSeriesList: response.data,
          showSeriesDropdown: true,
        });
      } else {
        updateState({
          searchSeriesList: [],
          showSeriesDropdown: false,
        });
      }
    } catch (error) {
      console.log('getSearchBooksList failed:', error.message);
      showCustomToast(LABELS.error, error.message);
    } finally {
      // updateState({ loading: false });
    }
  }

  // const fetchSeriesEpisodesResults = async (query) => {
  //   console.log('fdfsfs', currentLocation?.latitude, currentLocation?.longitude)
  //   // updateState({ loading: true });
  //   try {
  //     const response = await actions.getSearchSeriesEpisodesList(query);
  //     console.log('getSearchSeriesEpisodesList response', response);

  //     if (response && response.data.length > 0) {
  //       updateState({
  //         searchList: response.data,
  //         showSeriesDropdown: true,
  //       });
  //     } else {
  //       updateState({
  //         searchList: [],
  //         showSeriesDropdown: false,
  //       });
  //     }
  //   } catch (error) {
  //     console.log('getSearchBooksList failed:', error.message);
  //     showCustomToast(LABELS.error, error.message);
  //   } finally {
  //     // updateState({ loading: false });
  //   }
  // }

  const onChangeText = (text) => {
    console.log('client id in change text', clientId);
    if (selectedListLabel.toLowerCase() === MISC.podcasts) {
      updateState({ episodeTitle: text, showSeriesDropdown: false });
    } else {
      updateState({ title: text, clientId: '' });
    }
    if (text.length > 2
      && (selectedListLabel.toLowerCase() === MISC.books
        || selectedListLabel.toLowerCase() === MISC.movies
        || selectedListLabel.toLowerCase() === MISC.beer
        || selectedListLabel.toLowerCase() === MISC.tvShows
        || selectedListLabel.toLowerCase() === MISC.restaurants
        || selectedListLabel.toLowerCase() === MISC.podcasts
        || selectedListLabel.toLowerCase() === MISC.bourbon
        || selectedListLabel.toLowerCase() === MISC.wine)
    ) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

      // Debounce API call by 500ms
      debounceTimeout.current = setTimeout(() => {
        fetchResults(text.trim());
      }, 500);
    }
  };

  const onSeriesChangeText = (text) => {
    console.log('client id in change text', clientId);
    updateState({ seriesTitle: text, clientId: '', showDropdown: false });
    if (text.length > 2 && (selectedListLabel.toLowerCase() === MISC.podcasts)
    ) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

      // Debounce API call by 500ms
      debounceTimeout.current = setTimeout(() => {
        fetchSeriesResults(text.trim());
      }, 500);
    }
  };
  const handleSeriesSelectTitle = (item) => {
    console.log('selected item client id', item?.client_id);
    updateState({
      seriesTitle: item?.title || '',
      clientId: item?.client_id || item?.podcast_id || '',
      showDropdown: false,
      showSeriesDropdown: false,
      searchList: [],
      searchSeriesList: [],
      publisher: item?.publisher || '',
    });
  }

  const handleSelectTitle = (item) => {
    if (selectedListLabel.toLowerCase() === MISC.podcasts) {
      updateState({
        episodeTitle: item?.title || '',
        clientId: item?.client_id || item?.podcast_id || '',
        showDropdown: false,
        showSeriesDropdown: false,
        searchList: [],
        searchSeriesList: [],
        publisher: item?.publisher || '',
      });
    } else {
      updateState({
        title: selectedListLabel.toLowerCase() === MISC.wine
          ? `${item?.winery || ''} ${item?.variety || ''}`
          : item?.title || item?.name || '',
        author: item?.author || '',
        brewery: item?.brewery || '',
        movieReleaseDate: item?.release_date || '',
        location: item?.location?.formatted_address || '',
        clientId: item?.client_id || item?.podcast_id || '',
        showDropdown: false,
        showSeriesDropdown: false,
        searchList: [],
        searchSeriesList: [],
        variety: item?.variety || '',
        winery: item?.winery || '',
        province: item?.province || '',
        tvShowsType: item?.type || '',
        language: item?.language || '',
        genres: item?.genres || '',
      });
    }
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelectTitle(item)}>
      {(selectedListLabel.toLowerCase() === MISC.restaurants)
        ? <Text style={styles.label}>{item.name} - ({item?.location?.formatted_address})</Text>
        : selectedListLabel.toLowerCase() === MISC.wine
          ? <Text style={styles.label}>{item?.winery} - {item?.variety}</Text>
          : <Text style={styles.label}>
            {item.title || item.name || item.series_title || item.episode_title}
            {item?.release_date ? ` (${moment(item?.release_date, 'YYYY-MM-DD').year()})`
              : item?.author ? ` (${item?.author})`
                : item?.publisher ? ` - (${item?.publisher})`
                  // : item?.type ? ` - (${item?.type})`
                  : item?.brewery ? ` (${item?.brewery})` : ''}
          </Text>}
    </TouchableOpacity>
  );

  const renderSeriesItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSeriesSelectTitle(item)}>
      <Text style={styles.label}>{item.title} ({item?.publisher})</Text>
    </TouchableOpacity>
  );

  const handleAddPress = () => {
    // Add your navigation or action here
    updateState({ addItemModalVisible: true });
  };

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
      setTimeout(() => {
        Keyboard.dismiss();
      }, 100);
    }
  }

  const handleSaveNewList = async (newItem) => {
    Keyboard.dismiss();
    const validation = validator.isValidData(
      {
        title: newItem?.label,
      }
    );
    if (!validation.valid) {
      showCustomToast(LABELS.error, validation.message);
      return;
    }
    updateState({ loading: true });
    try {
      const payload = {
        label: newItem?.label,
        icon: newItem?.icon,
      };
      const response = await actions.addList(payload);
      console.log('addList response:', response);
      // navigation.goBack();
      const key = Date.now().toString();
      updateState({
        addItemModalVisible: false,
        needListTypeApiCall: true,
        newelyAddedList: payload,
        ...resetPayloads
      });
      showCustomToast(LABELS.success, MISC.listAddedSuccessfully)
    } catch (error) {
      console.log('addItem failed:', error.message);
      showCustomToast(LABELS.error, error.message);
    } finally {
      updateState({ loading: false });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Loader modalVisible={loading} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
        keyboardShouldPersistTaps="handled"
      >

        <Header title={MISC.addItem} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollRef}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
            }}
          // keyboardShouldPersistTaps="handled"
          >
            <View style={styles.mainView}>

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

                      ...resetPayloads,
                    });
                    setOpen(false);
                  }}
                  placeholder="Select a category"
                  style={styles.dropdown}
                  textStyle={{ fontSize: 16, color: COLORS.black }}
                  dropDownContainerStyle={styles.dropdownBox}
                  listMode="SCROLLVIEW"
                />
              </View>}

              <TouchableOpacity onPress={handleAddPress} style={{ alignSelf: 'flex-end', paddingVertical: 8, paddingLeft: 8 }}>
                <Text style={styles.addNewList}>+ Add New List</Text>
              </TouchableOpacity>

              {/* Title Input */}
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
                  <View>
                    <CustomInput
                      placeholder={LABELS.typeSomethingHere}
                      value={seriesTitle}
                      mainViewProps={{ marginVertical: 12 }}
                      // onChangeText={(val) => updateState({ seriesTitle: val.replace(/[^A-Za-z0-9 ]/g, '') })}
                      onChangeText={onSeriesChangeText}
                      label={LABELS.seriesTitle}
                      isOptional={podcastType.label === MISC.episode}
                    />
                    {showSeriesDropdown && dataList.length > 0 && (seriesTitle.length > 0)
                      && (
                        <View style={[styles.listAbsolute,]}>
                          <ScrollView horizontal
                            contentContainerStyle={{
                              maxHeight: 280, width: SCREEN_WIDTH - 32,
                              flexGrow: 1
                            }}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={false}>
                            <FlatList
                              data={searchSeriesList}
                              keyExtractor={(item, index) => index.toString()}
                              renderItem={renderSeriesItem}
                              contentContainerStyle={{ padding: 8, gap: 8, flexGrow: 1 }}
                              // keyboardShouldPersistTaps="handled"
                              showsHorizontalScrollIndicator={false}
                              nestedScrollEnabled={true}
                              scrollEnabled={true}
                            />
                          </ScrollView>
                        </View>
                      )}
                  </View>
                </>}

              {/* Title Input */}
              <View style={styles.searchBox}>
                {selectedListLabel.toLowerCase() === MISC.podcasts
                  ? <><CustomInput
                    placeholder={LABELS.typeSomethingHere}
                    value={episodeTitle}
                    mainViewProps={{ marginVertical: 12 }}
                    onChangeText={onChangeText}
                    maxLength={100}
                    label={LABELS.episodeTitle}
                    isOptional={podcastType.label === MISC.series}
                  />
                    <CustomInput
                      placeholder={LABELS.publisher}
                      value={publisher}
                      onChangeText={(val) => updateState({ publisher: val })}
                      label={LABELS.publisher}
                      mainViewProps={{ marginVertical: 12 }}
                      editable={false}
                      maxLength={100}
                      isOptional={true}
                    />
                  </>
                  : <CustomInput
                    placeholder={LABELS.typeSomethingHere}
                    value={title}
                    mainViewProps={{ marginVertical: 12 }}
                    onChangeText={onChangeText}
                    maxLength={100}
                    label={(selectedListLabel.toLowerCase() === MISC.bourbon
                      || selectedListLabel.toLowerCase() === MISC.wine
                      || selectedListLabel.toLowerCase() === MISC.restaurants
                      || selectedListLabel.toLowerCase() === MISC.beer) ? LABELS.name : LABELS.title}
                  />}
                {showDropdown && dataList.length > 0 && (title.length > 0 || episodeTitle.length > 0)
                  && (
                    <View style={[styles.listAbsolute,]}>
                      <ScrollView horizontal
                        contentContainerStyle={{
                          maxHeight: 280, width: SCREEN_WIDTH - 32,
                          flexGrow: 1
                        }}
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled={false}>
                        <FlatList
                          data={searchList}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={renderItem}
                          contentContainerStyle={{ padding: 8, gap: 8, flexGrow: 1 }}
                          // keyboardShouldPersistTaps="handled"
                          showsHorizontalScrollIndicator={false}
                          nestedScrollEnabled={true}
                          scrollEnabled={true}
                        />
                      </ScrollView>
                    </View>
                  )}
              </View>

              {selectedListLabel.toLowerCase() === MISC.movies &&
                <CustomInput
                  placeholder={LABELS.typeSomethingHere}
                  value={movieReleaseDate}
                  mainViewProps={{ marginVertical: 12 }}
                  onChangeText={(val) => updateState({ movieReleaseDate: val.replace(/[^A-Za-z0-9 -]/g, '') })}
                  label={LABELS.releaseDate}
                  isOptional={true}
                />}

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
              {/* tv shows */}
              {selectedListLabel.toLowerCase() === MISC.tvShows &&
                <>
                  <CustomInput
                    placeholder={LABELS.type}
                    value={tvShowsType}
                    onChangeText={(val) => updateState({ tvShowsType: val })}
                    label={LABELS.type}
                    mainViewProps={{ marginVertical: 12 }}
                    editable={false}
                    maxLength={100}
                    isOptional={true}
                  />
                  <CustomInput
                    placeholder={LABELS.language}
                    value={language}
                    onChangeText={(val) => updateState({ language: val })}
                    label={LABELS.language}
                    mainViewProps={{ marginVertical: 12 }}
                    editable={false}
                    maxLength={100}
                    isOptional={true}
                  />
                  <CustomInput
                    placeholder={LABELS.genres}
                    value={genres}
                    onChangeText={(val) => updateState({ genres: val })}
                    label={LABELS.genres}
                    mainViewProps={{ marginVertical: 12 }}
                    editable={false}
                    maxLength={100}
                    isOptional={true}
                  />
                </>
              }
              {/* wine type */}
              {selectedListLabel.toLowerCase() === MISC.wine &&
                <>
                  <CustomInput
                    placeholder={LABELS.variety}
                    value={variety}
                    onChangeText={(val) => updateState({ variety: val })}
                    label={LABELS.variety}
                    mainViewProps={{ marginVertical: 12 }}
                    editable={false}
                    maxLength={100}
                    isOptional={true}
                  />
                  <CustomInput
                    placeholder={LABELS.winery}
                    value={winery}
                    onChangeText={(val) => updateState({ winery: val })}
                    label={LABELS.winery}
                    mainViewProps={{ marginVertical: 12 }}
                    editable={false}
                    maxLength={100}
                    isOptional={true}
                  />
                  <CustomInput
                    placeholder={LABELS.province}
                    value={province}
                    onChangeText={(val) => updateState({ province: val })}
                    label={LABELS.province}
                    mainViewProps={{ marginVertical: 12 }}
                    editable={false}
                    maxLength={100}
                    isOptional={true}
                  />
                </>
              }

              {(selectedListLabel.toLowerCase() === MISC.bourbon || selectedListLabel.toLowerCase() === MISC.wine
                || selectedListLabel.toLowerCase() === MISC.tvShows) &&
                <>
                  <CustomInput
                    placeholder={LABELS.typeSomethingHere}
                    value={year}
                    mainViewProps={{ marginVertical: 12 }}
                    onChangeText={(val) => {
                      // Allow only digits
                      const filtered = val.replace(/[^0-9]/g, '');
                      if (filtered.length <= 4) {
                        updateState({ year: filtered });
                        // Auto-validate when 4 digits are entered
                        if (filtered.length === 4) {
                          const yearNumber = parseInt(filtered);
                          if (yearNumber < 1000 || yearNumber > currentYear) {
                            Keyboard.dismiss(); // Hide keyboard
                            showCustomToast(LABELS.error, `Year must be between 1000 and ${currentYear}`);
                            updateState({ year: '' });
                          }
                        }
                      }
                    }}
                    label={selectedListLabel.toLowerCase() === MISC.tvShows ? LABELS.releaseYear : LABELS.year}
                    maxLength={10}
                    keyboardType={'numeric'}
                    isOptional={true}
                  />
                </>
              }

              <TouchableOpacity onPress={() => updateState({ saveForLater: !saveForLater })} style={styles.checkboxContainer}>
                <Ionicons
                  name={saveForLater ? 'checkbox-outline' : 'square-outline'}
                  size={24}
                  color={saveForLater ? COLORS.black : COLORS.borderGray}
                />
                <Text style={styles.checkboxLabel}>Save for Later</Text>
              </TouchableOpacity>

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
                    <TouchableOpacity key={i} onPress={() => updateState({ rating: i })}>
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
                onFocus={() => {
                  setTimeout(() => {
                    scrollRef.current?.scrollToEnd({ animated: true });
                  }, 100); // delay helps wait for keyboard to show
                }}
                keyboardType={undefined}
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
                    maxLength={150}
                    icon={'cloud-upload-outline'}
                    iconPress={() => updateState({ imageModalVisible: true })}
                  />
                  {imageUrl.length > 0 && (imageUrl.includes('http://') || imageUrl.includes('https://')) &&
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
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Add New List Popup Modal */}
      <AddNewListModal
        selectedItem={selectedItem}
        modalVisible={addItemModalVisible}
        setModalVisible={(val) => updateState({ addItemModalVisible: val })}
        onSave={handleSaveNewList}
      />

      {/* Image Picker Modal */}
      <ImageModal
        modalVisible={imageModalVisible}
        setModalVisible={(val) => updateState({ imageModalVisible: val })}
        onImageSelected={onImageSelectedHandler}
      />
    </SafeAreaView>
  );
}

export default AddScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {},
  mainView: { padding: 16, flex: 1 },
  headerIndicator: {
    alignSelf: 'center',
    width: 40,
    height: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginBottom: 16,
  },
  header: { fontSize: 18, fontWeight: '400', color: COLORS.black, marginBottom: 32 },
  label: { fontWeight: '400', fontSize: 16, color: COLORS.black, },
  addNewList: { fontWeight: '400', fontSize: 16, color: COLORS.accent, textDecorationLine: 'underline' },
  dropdownContainer: {
    marginTop: 4,
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
  checkboxLabel: { marginLeft: 8, fontSize: 16, fontWeight: '400', color: COLORS.black, },
  radioGroup: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
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
  starContainer: { flexDirection: 'row', marginVertical: 16 },
  optional: { fontStyle: 'italic', fontSize: 12, color: '#888' },
  notesInput: { height: 80, textAlignVertical: 'top' },
  cancelButton: { alignItems: 'center', },
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
    // marginBottom: 16,
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
