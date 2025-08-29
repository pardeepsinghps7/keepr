import React, { useState, useEffect, useCallback, useRef } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { View, ActivityIndicator, StyleSheet, Text, FlatList, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import actions from '../redux/actions';
import COLORS from '../constants/colors';
import { useFocusEffect } from '@react-navigation/native';
import CustomInput from './CustomInput';
import { STRINGS } from '../constants/strings';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const CountryStateCityPicker = ({
    isCurrentLocationEnabled = false,
    isDisable = false,
    selectedCountry,
    selectedState,
    selectedStateName,
    selectedCity,
    onSelect,
    onCancel,
}) => {
    const { LABELS, MISC } = STRINGS
    console.log('isCurrentLocationEnabled',isCurrentLocationEnabled)
    // Country
    const [countryOpen, setCountryOpen] = useState(false);
    const [countryValue, setCountryValue] = useState(null);
    const [countries, setCountries] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(false);

    // State
    const [stateOpen, setStateOpen] = useState(false);
    const [stateValue, setStateValue] = useState(null);
    const [states, setStates] = useState([]);
    const [loadingStates, setLoadingStates] = useState(false);

    // City
    const [cityOpen, setCityOpen] = useState(false);
    const [cityValue, setCityValue] = useState(null);
    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);

    const debounceTimeout = useRef(null);

    const [state, setState] = useState({
        showDropdown: false,
        searchList: [],
        searchText: '',
    });
    const { showDropdown, searchList, searchText } = state;
    const updateState = (data) => setState((prev) => ({ ...prev, ...data }));

    if (!isDisable) {
        // Reset dropdowns when screen is focused
        useFocusEffect(
            useCallback(() => {
                clearData();
                setCurrentLocation();
                // resetAll();
                // fetchCountries();
            }, [isCurrentLocationEnabled])
        );

        // const resetAll = () => {
        //     setCountries([]);
        //     setStates([]);
        //     setCities([]);
        //     setCountryValue(null);
        //     setStateValue(null);
        //     setCityValue(null);
        // };
        // Fetch Countries
        // const fetchCountries = async () => {
        //     setLoadingCountries(true);
        //     const res = await actions.getCountries();
        //     if (res?.length) {
        //         setCountries(res.map((item, index) => ({ label: item.country, value: item.country })));
        //     }
        //     setLoadingCountries(false);
        // };

        // Fetch States
        // useEffect(() => {
        //     if (countryValue) {
        //         const fetchStates = async () => {
        //             setLoadingStates(true);
        //             const res = await actions.getCountryStates(countryValue);
        //             if (res?.length) {
        //                 setStates(res.map((item, index) => ({ label: item.state_name, value: item.state_id })));
        //             } else {
        //                 setStates([]);
        //             }
        //             setLoadingStates(false);
        //             setStateValue(null);
        //             setCities([]);
        //             setCityValue(null);
        //         };
        //         fetchStates();
        //     }
        // }, [countryValue]);

        // // Fetch Cities
        // useEffect(() => {
        //     if (stateValue) {
        //         const fetchCities = async () => {
        //             setLoadingCities(true);
        //             const res = await actions.getCountryStateCities(countryValue, stateValue);
        //             if (res?.length) {
        //                 setCities(res.map((item, index) => ({ label: item.city, value: `${item.city_ascii}_${index}` })));
        //             } else {
        //                 setCities([]);
        //             }
        //             setLoadingCities(false);
        //             setCityValue(null);
        //         };
        //         fetchCities();
        //     }
        // }, [stateValue]);

        // Call onSelect every time a value changes
        // useEffect(() => {
        //     // Strip `_index` part to get real city name
        //     const actualCity = cityValue?.split('_')[0] || null;
        //     console.log("Selected city:", actualCity);
        //     onSelect?.({
        //         country: countryValue,
        //         state: stateValue,
        //         city: actualCity,
        //     });
        // }, [countryValue, stateValue, cityValue]);
    }
    // Close others when one opens
    const handleCountryOpen = (open) => {
        setCountryOpen(open);
        if (open) {
            setStateOpen(false);
            setCityOpen(false);
        }
    };

    const handleStateOpen = (open) => {
        setStateOpen(open);
        if (open) {
            setCountryOpen(false);
            setCityOpen(false);
        }
    };

    const handleCityOpen = (open) => {
        setCityOpen(open);
        if (open) {
            setCountryOpen(false);
            setStateOpen(false);
        }
    };

    if (isDisable) {
        useEffect(() => {
            updateState({
                searchText: `${selectedCity}, ${selectedStateName}, ${selectedCountry}`
            });
            setCurrentLocation();
        }, [isCurrentLocationEnabled]);
    }
    // If disabled, set selected values directly


    const fetchResults = async (query) => {
        console.log('query', query)
        // updateState({ loading: true });
        // console.log('fetch item client id',item?.client_id);
        try {
            const response = await actions.getSearchCountriesList(query);
            console.log('getSearchItemsList response', response);

            if (response && response?.length > 0) {
                updateState({
                    searchList: response,
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

    const renderItem = ({ item }) => {
        // console.log('item search', item);
        return <TouchableOpacity style={styles.item} onPress={() => handleSelectTitle(item)}>
            <Text style={styles.label}>{`${item.city}, ${item.state_name}, ${item.country}`}</Text>
        </TouchableOpacity>
    };

    const handleSelectTitle = (item) => {
        onSelect?.({
            country: item.country,
            state_id: item.state_id,
            state_name: item.state_name,
            city: item.city,
        });
        updateState({
            showDropdown: false,
            searchList: [],
            searchText: `${item.city}, ${item.state_name}, ${item.country}`
        });
        // navigation.navigate(ROUTES.itemDetailsScreen, { item: item })
    }

    const onChangeText = (text) => {
        updateState({ searchText: text });

        if (text.length == 0) {
            updateState({ showDropdown: false, searchList: [] });
        }
        else if (text.length > 2) {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

            // Debounce API call by 500ms
            debounceTimeout.current = setTimeout(() => {
                fetchResults(text.trim());
            }, 500);
        }
    };

    const clearData = (isDeleteCurrentLocation = false) => {
        onCancel?.(isDeleteCurrentLocation);
        updateState({ showDropdown: false, searchList: [], searchText: '' })
    }

    const setCurrentLocation = () => {
        if (isCurrentLocationEnabled) {
            updateState({
                searchText: LABELS.currentLocation,
            });
        }
    }

    return (
        <View style={{ zIndex: 999, gap: 10 }}>
            <CustomInput
                label={LABELS.location}
                placeholder={LABELS.searchCityState}
                value={searchText}
                maxLength={100}
                onChangeText={onChangeText}
                icon={!isDisable && searchText.length > 0 ? 'close-circle' : null}
                isSearch={isCurrentLocationEnabled || searchText.length > 0 ? false : true}
                iconPress={() => clearData(true)}
                mainViewProps={{ marginTop: 16 }}
                editable={!isDisable && searchText !== LABELS.currentLocation}
                style={{
                    backgroundColor: isDisable ? COLORS.lighterGray : undefined
                }}
            />
            {showDropdown && searchList.length > 0
                && (
                    <View style={[styles.listAbsolute,]}>
                        <ScrollView horizontal
                            contentContainerStyle={{
                                maxHeight: 280, width: SCREEN_WIDTH,
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
            {/* {isDisable ?
                <>
                    <CustomInput
                        placeholder={'Country'}
                        value={selectedCountry}
                        label={'Country'}
                        editable={false}
                        style={{
                            backgroundColor: COLORS.lighterGray
                        }}

                    />
                    <CustomInput
                        placeholder={'State'}
                        value={selectedState}
                        label={'State'}
                        editable={false}
                        style={{
                            backgroundColor: COLORS.lighterGray
                        }}
                    />
                    <CustomInput
                        placeholder={'City'}
                        value={selectedCity}
                        label={'City'}
                        editable={false}
                        style={{
                            backgroundColor: COLORS.lighterGray
                        }}
                    />
                </>
                :
                <> */}
            {/* Country */}
            {/* {loadingCountries ? (
                        <ActivityIndicator size="small" color="#000" />
                    ) : (
                        <View>
                            <Text style={styles.label}>Select Country</Text>
                            <DropDownPicker

                                open={countryOpen}
                                value={countryValue}
                                items={countries}
                                setOpen={handleCountryOpen}
                                setValue={(cb) => {
                                    setCountryValue(prev => {
                                        const val = cb(prev);
                                        if (val) setCountryOpen(false);
                                        return val;
                                    });
                                }}
                                setItems={setCountries}
                                placeholder="Select Country"
                                zIndex={3000}
                                zIndexInverse={1000}
                                disabled={isDisable ?? loadingCountries}
                                listMode="SCROLLVIEW"
                                maxHeight={250}
                                style={styles.dropdown}
                                textStyle={{ fontSize: 16, color: COLORS.black }}
                                dropDownContainerStyle={styles.dropdownBox}
                            />
                        </View>
                    )} */}

            {/* State */}
            {/* {countryValue && (
                        loadingStates ? (
                            <ActivityIndicator size="small" color="#000" />
                        ) : (
                            <View>
                                <Text style={styles.label}>Select State</Text>
                                <DropDownPicker
                                    open={stateOpen}
                                    value={stateValue}
                                    items={states}
                                    setOpen={handleStateOpen}
                                    setValue={(cb) => {
                                        setStateValue(prev => {
                                            const val = cb(prev);
                                            if (val) setStateOpen(false);
                                            return val;
                                        });
                                    }}
                                    setItems={setStates}
                                    placeholder="Select State"
                                    zIndex={2000}
                                    zIndexInverse={2000}
                                    disabled={loadingStates}
                                    listMode="SCROLLVIEW"
                                    maxHeight={250}
                                    style={styles.dropdown}
                                    textStyle={{ fontSize: 16, color: COLORS.black }}
                                    dropDownContainerStyle={styles.dropdownBox}
                                />
                            </View>
                        )
                    )} */}

            {/* City */}
            {/* {stateValue && (
                        loadingCities ? (
                            <ActivityIndicator size="small" color="#000" />
                        ) : (
                            <View>
                                <Text style={styles.label}>Select City/Province</Text>
                                <DropDownPicker
                                    open={cityOpen}
                                    value={cityValue}
                                    items={cities}
                                    setOpen={handleCityOpen}
                                    setValue={(cb) => {
                                        setCityValue(prev => {
                                            const val = cb(prev);
                                            if (val) setCityOpen(false);
                                            return val;
                                        });
                                    }}
                                    setItems={setCities}
                                    placeholder="Select City/Province"
                                    zIndex={1000}
                                    zIndexInverse={3000}
                                    disabled={loadingCities}
                                    listMode="SCROLLVIEW"
                                    maxHeight={250}
                                    style={styles.dropdown}
                                    textStyle={{ fontSize: 16, color: COLORS.black }}
                                    dropDownContainerStyle={styles.dropdownBox}
                                />
                            </View>
                        )
                    )} */}
            {/* </> */}
            {/* } */}
        </View>
    );
};

export default CountryStateCityPicker;

const styles = StyleSheet.create({
    label: { fontWeight: '400', fontSize: 16, color: COLORS.black, marginBottom: 4 },
    dropdown: {
        borderColor: COLORS.borderGray,
        marginBottom: 12,
    },
    dropdownBox: {
        borderWidth: 0.5,
        borderColor: COLORS.borderGray,
        paddingVertical: 8
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
    label: { fontWeight: '400', fontSize: 16, color: COLORS.black, },
});
