import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  FlatList,
  Switch,
  Keyboard,
} from 'react-native';
import COLORS from '../../constants/colors';
import { ROUTES, STRINGS } from '../../constants/strings';
import { CustomButton, CustomRatings, EditListModal, FilterPopupModal, getStatusList, Header, ListPopupModal, Loader, showCustomToast, SortPopupModal, } from '../..';
import { useSelector } from 'react-redux';
import actions from '../../redux/actions';
import Icon from 'react-native-vector-icons/Ionicons';
import imagesPath from '../../constants/images';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import validator from '../../utils/validators';
import { capitalizeEachWord, toSingular } from '../../utils/utils';

const ListDetailsScreen = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const userData = useSelector((state) => state.auth.userData);
  const { params } = route
  const { item: listItem } = params
  const { LABELS, TITLES, SIGNUP, MISC, VALIDATIONS, BUTTONS } = STRINGS;
  const [rating, setRating] = useState(0);
  const [state, setState] = useState({
    listTitle: listItem?.label || '',
    listIcon: listItem?.icon || '',
    modalVisible: false,
    loading: false,
    saveForLater: false,
    dataList: [],
    selectedSortItem: '',
    selectedActionItem: '',
    listActionModalVisible: false,
    sortModalVisible: false,
    filterModalVisible: false,
    editListModalVisible: false,
    isInitial: true,
    statusList: [],
  });

  const updateState = (data) => setState((prev) => ({ ...prev, ...data }));

  const {
    listTitle,
    listIcon,
    modalVisible,
    loading,
    saveForLater,
    dataList,
    selectedActionItem,
    selectedSortItem,
    listActionModalVisible,
    sortModalVisible,
    filterModalVisible,
    editListModalVisible,
    isInitial,
    statusList,
  } = state;

  useFocusEffect(
    useCallback(() => {
      init();
    }, [saveForLater, selectedSortItem])
  );


  const init = async () => {
    updateState({ loading: true });
    try {
      const statusList = getStatusList(listItem?.label);
      const response = await actions.getItemListByListId(listItem.id + selectedSortItem + (isInitial ? '' : `&save_for_later=eq.${saveForLater}`));
      console.log('getItemListByListId response', response);
      updateState({ dataList: response, statusList: statusList, loading: false, });
    } catch (error) {
      console.log('getItemListByListId failed:', error.message);
      showCustomToast(LABELS.error, error.message);
    } finally {
      updateState({ loading: false, isInitial: false });
    }
  }

  const onMenuPress = () => {
    updateState({ listActionModalVisible: true })
  }

  const handleAddPress = () => {
    console.log('Floating button pressed!');
    // Add your navigation or action here
    navigation.navigate(ROUTES.main, {
      screen: ROUTES.add,
      params: { item: listItem }
    });
  };

  const renderItem = ({ index, item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(ROUTES.itemDetailsScreen, { item })}>
      <View style={styles.cardItems}>
        <Image style={styles.iconImageStyle} source={{ uri: listItem.icon }} />
        <View style={styles.cardItemDetails}>
          <Text style={styles.cardTitle}>
            {capitalizeEachWord(item?.title || item?.episode_title || item?.series_title)}</Text>
          <RatingWatchDetail item={item} index={index} />
          <Text style={styles.itemSubtitle}>Recommended by: <Text style={{ color: COLORS.accent }}>{capitalizeEachWord(item?.recommended_by)}</Text></Text>
          <Text style={styles.itemSubtitle}>Notes: {capitalizeEachWord(item?.notes)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const RatingWatchDetail = ({ item, index }) => {
    return (
      <View style={[styles.row, { gap: 16, }]}>
        {!item?.status?.includes('not_') && !item?.status?.includes('to_') && !item?.status?.includes('want_to_') && item?.rating > 0 &&
          <CustomRatings list={[1, 2, 3, 4, 5]} rating={item?.rating || 0} setRating={setRating} selectedSize={16} unselectedSize={14} gap={2} isDisable={true} />}
        <View style={[styles.row, { gap: 8, }]}>
          <Image source={imagesPath.watch} style={styles.watchImageStyle} />
          <Text style={styles.itemSubtitle}>{capitalizeEachWord(item?.status?.replace(/_/g, ' '))}</Text>
        </View>
        {item?.save_for_later === true && <Image source={imagesPath.favorite} style={styles.watchImageStyle} />}
      </View>
    )
  };

  const ListHeaderComponent = () => {
    return (
      <View style={{ gap: 8 }}>
        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <View style={styles.row}>
            <Text style={styles.itemSubtitle}>{MISC.totalItems}</Text>
            <View style={styles.itemCount}>
              <Text style={styles.itemSubtitle}>{dataList?.length || 0}</Text>
            </View>
          </View>
          <View style={[styles.row, { gap: 8 }]}>
            <TouchableOpacity style={styles.row} onPress={() => updateState({ sortModalVisible: true })}>
              <Icon name="filter" size={20} color={COLORS.black} />
              <Text style={styles.itemSubtitle}>{MISC.sortBy}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={() => updateState({ filterModalVisible: true })}>
              <Image source={imagesPath.filter} style={styles.watchImageStyle} />
              <Text style={styles.itemSubtitle}>{MISC.filterBy}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.row, { gap: 0, justifyContent: 'flex-end' }]}>
          <Text style={[styles.itemSubtitle, { color: COLORS.black }]}>{LABELS.savedForLater}</Text>
          <Switch
            value={saveForLater}
            onValueChange={(val) => updateState({ saveForLater: val, })}
            trackColor={{ false: COLORS.lightBg, true: COLORS.accent }}
            thumbColor={COLORS.white}
            style={{
              transform: Platform.OS === 'android'
                ? [{ scaleX: 1 }, { scaleY: 1 }] : [{ scaleX: .7 }, { scaleY: .7 }]
            }}
          />
        </View>
      </View>
    )
  }

  const ListEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Image style={styles.iconImageStyle} source={{ uri: listIcon }} />
        <Text style={styles.cardTitle}>{MISC.noItemsTitle}</Text>
        {selectedSortItem.length === 0 &&
          <>
            <Text style={styles.itemSubtitle}>Notes: {MISC.noItemsSubtitle}</Text>
            <CustomButton title={`+ ${BUTTONS.addYourFirst} ${toSingular(listTitle)}`}
              onPress={() => navigation.navigate(ROUTES.main, {
                screen: ROUTES.add,
                params: { item: listItem },
              })} />
          </>}
      </View>
    )
  }
  const handleSaveNewList = async (val) => {
    console.log('filter save', val)
    updateState({ selectedSortItem: val.value, saveForLater: val.saveForLater, filterModalVisible: false });
  }

  const handleUpdateList = async (newItem) => {
    console.log('handleUpdateList new item', newItem)
    Keyboard.dismiss();
    // const validation = validator.isValidData(
    //   {
    //     title: newItem?.label,
    //   }
    // );
    // console.log('validation', validation)
    // if (!validation.valid) {
    //   showCustomToast(LABELS.error, validation.message);
    //   // console.error(validation.message)
    //   return;
    // }
    updateState({ loading: true });
    try {
      const payload = {
        label: newItem?.label,
        icon: newItem?.icon,
      };
      console.log('handleUpdateList payload', payload, listItem?.id)
      const response = await actions.updateList(listItem?.id, payload);
      console.log('updateList response:', response);

      // ✅ Update dataList here
      // const updatedList = dataList;
      // const index = updatedList.findIndex(item => item.id === listItem?.id);
      // if (index !== -1) {
      //   updatedList[index] = {
      //     ...updatedList[index],
      //     ...payload,
      //   };
      // }
      updateState({
        listTitle: newItem?.label,
        listIcon: newItem?.icon,
        // dataList: updatedList,
        editListModalVisible: false,
      });
      showCustomToast(LABELS.success, MISC.listUpdatedSuccessfully)
    } catch (error) {
      console.log('updateItem failed:', error.message);
      showCustomToast(LABELS.error, error.message);
    } finally {
      updateState({ loading: false });
    }
  };

  const deleteSelectedItem = async () => {
    updateState({ loading: true });
    try {
      const response = await actions.deleteList(listItem?.id);
      console.log('deleteList response:', response);
      // const updatedList = dataList.filter((cat) => cat.id !== listItem.id);
      updateState({ listActionModalVisible: false });
      showCustomToast(LABELS.success, MISC.listDeletedSuccessfully);
      navigation.goBack();
    } catch (error) {
      console.log('deleteList failed:', error.message);
      showCustomToast(LABELS.error, error.message);
    } finally {
      updateState({ loading: false });
    }

  };

  const handleEdit = () => {
    updateState({ listActionModalVisible: false, editListModalVisible: true });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{ flex: 1 }}>
        <Loader modalVisible={loading} />
        <Header title={listTitle} isBack onMenuPress={listItem?.is_default ? undefined : onMenuPress} />
        <FlatList
          data={dataList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          // numColumns={2}
          // columnWrapperStyle={styles.grid}
          contentContainerStyle={{ padding: 16, gap: 16, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={!loading && ListEmptyComponent}
        />

        {dataList.length > 0 && <TouchableOpacity style={styles.fab} onPress={handleAddPress}>
          <Icon name="add" size={28} color={COLORS.black} />
        </TouchableOpacity>}
      </KeyboardAvoidingView>
      {/* List Popup Modal */}
      <SortPopupModal
        statusList={statusList}
        selectedItem={selectedSortItem}
        modalVisible={sortModalVisible}
        onSelectItem={(val) => {
          if (val.includes(MISC.sortSaveForLater))
            updateState({ selectedSortItem: val, sortModalVisible: false, saveForLater: true });
          else
            updateState({ selectedSortItem: val, sortModalVisible: false });
        }}
        setModalVisible={(val) => updateState({ sortModalVisible: val })}
      />
      {/* List Popup Modal */}
      <FilterPopupModal
        statusList={statusList}
        selectedItem={selectedSortItem}
        modalVisible={filterModalVisible}
        setModalVisible={(val) => updateState({ filterModalVisible: val })}
        onSave={handleSaveNewList}
      />
      {/* List Popup Modal */}
      <ListPopupModal
        selectedItem={selectedActionItem}
        modalVisible={listActionModalVisible}
        setModalVisible={(val) => updateState({ listActionModalVisible: val })}
        onEdit={handleEdit}
        onDelete={deleteSelectedItem}
      />

      {/* Edit List Popup Modal */}
      <EditListModal
        data={{ label: listTitle, icon: listIcon }}
        selectedItem={selectedActionItem}
        modalVisible={editListModalVisible}
        setModalVisible={(val) => updateState({ editListModalVisible: val })}
        onSave={handleUpdateList}
      />
    </SafeAreaView>
  );
}

export default ListDetailsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    // width: '47%',
    // height: 70,
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    position: 'relative',

  },
  cardItems: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: '90%',
  },
  iconImageStyle: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: COLORS.accent
  },
  cardItemDetails: {
    gap: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.text_secondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4

  },
  watchImageStyle: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  itemSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.text_secondary,
  },
  itemCount: { backgroundColor: COLORS.lightBg, padding: 4, borderRadius: 4 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: COLORS.primary, // or any color you want
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // for Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  emptyContainer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
});
