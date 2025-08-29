// Helper functions
import { Image, StyleSheet, Text, View, Platform, Alert, Share, PermissionsAndroid } from "react-native";
import { showMessage } from "react-native-flash-message";
import imagesPath from "../constants/images";
import COLORS from "../constants/colors";
import Icon from 'react-native-vector-icons/Ionicons';
import { STRINGS } from "../constants/strings";
import GetLocation from "react-native-get-location";
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import DocumentPicker from 'react-native-document-picker';

const trimText = (text) => text.trim();
const showError = (message) => {
    showMessage({
        type: 'danger',
        icon: 'danger',
        message
    })
}

const showSuccess = (message) => {
    showMessage({
        type: 'success',
        icon: 'success',
        message
    })
}
const showCustomToast = (type, message, options = {}) => {
    const { duration = 3000 } = options;
    const isSuccess = type === 'success';

    showMessage({
        message: '',
        type,
        duration: duration,
        backgroundColor: COLORS.transparent,
        renderCustomContent: () => (
            <View
                style={[
                    styles.toastContainer,
                    isSuccess ? styles.successContainer : styles.errorContainer,
                ]}
            >
                <Icon
                    name={isSuccess ? 'checkmark' : 'close'}
                    size={20}
                    color={isSuccess ? COLORS.green : COLORS.red}
                />
                <Text
                    style={
                        isSuccess ? styles.successToastText : styles.errorToastText
                    }
                >
                    {message}
                </Text>
            </View>
        ),
    });
};

const getStatusList = (label) => {
    const { MISC } = STRINGS;


    const booksStatusList = [
        { id: 0, key: MISC.filterRead, label: MISC.read },
        { id: 1, key: MISC.filterToRead, label: MISC.toRead }
    ];
    const movieStatusList = [
        { id: 0, key: MISC.filterWatched, label: MISC.watched },
        { id: 1, key: MISC.filterToWatch, label: MISC.toWatch }
    ];
    const podcastsStatusList = [
        { id: 0, key: MISC.filterListened, label: MISC.listen },
        { id: 1, key: MISC.filterToListen, label: MISC.toListen }
    ];
    const bourbonStatusList = [
        { id: 0, key: MISC.filterTried, label: MISC.tried },
        { id: 1, key: MISC.filterNotTried, label: MISC.notTried }
    ];
    const restaurantsStatusList = [
        { id: 0, key: MISC.filterVisited, label: MISC.visited },
        { id: 1, key: MISC.filterWantToVisit, label: MISC.wantToVisit }
    ];
    const tvShowStatusList = [
        { id: 0, key: MISC.filterWatched, label: MISC.watched },
        { id: 1, key: MISC.filterToWatch, label: MISC.toWatch }
    ];
    const beerStatusList = [
        { id: 0, key: MISC.filterTried, label: MISC.tried },
        { id: 1, key: MISC.filterNotTried, label: MISC.notTried }
    ];
    const customStatusList = [
        { id: 0, key: MISC.filterComplete, label: MISC.complete },
        { id: 1, key: MISC.filterNotCompleted, label: MISC.notCompleted }
    ];

    const list =
        label.toLowerCase() === MISC.books ? booksStatusList
            : label.toLowerCase() === MISC.podcasts ? podcastsStatusList
                : label.toLowerCase() === MISC.bourbon ? bourbonStatusList
                    : label.toLowerCase() === MISC.wine ? bourbonStatusList
                        : label.toLowerCase() === MISC.restaurants ? restaurantsStatusList
                            : label.toLowerCase() === MISC.tvShows ? tvShowStatusList
                                : label.toLowerCase() === MISC.beer ? beerStatusList
                                    : label.toLowerCase() === MISC.movies ? movieStatusList
                                        : customStatusList;
    console.log('getStatusList', label, label.toLowerCase() === MISC.books, list);
    return list;
}

const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;
    return await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
    });

    // .then(location => {
    //     console.log(location);
    //     return location;
    // })
    // .catch(error => {
    //     const { code, message } = error;
    //     // console.warn(code, message);
    //     return error;
    // })
}
export const requestLocationPermission = async () => {
    const { LABELS } = STRINGS;
    const permission =
        Platform.OS === 'ios'
            ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
            : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const result = await check(permission);

    if (result === RESULTS.GRANTED) {
        return true;
    }

    if (result === RESULTS.DENIED) {
        const req = await request(permission);
        return req === RESULTS.GRANTED;
    }

    if (result === RESULTS.BLOCKED) {
        // showCustomToast(LABELS.error,'Location permission is blocked. Open settings to enable it.')
        // Alert.alert(
        //     'Permission Blocked',
        //     'Location permission is blocked. Open settings to enable it.',
        //     [
        //         { text: 'Cancel', style: 'cancel' },
        //         {
        //             text: 'Open Settings',
        //             onPress: () => openSettings(),
        //         },
        //     ],
        // );
        return false;
    }

    return false;
};

const inviteFriend = async () => {
    try {
        const result = await Share.share({
            message: `Hey! Check out Keepr - your ultimate personal keeper. Download it now: https://example.com/download`, // Replace with your actual app link
        });

        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                // shared with activity type
            } else {
                // shared
            }
        } else if (result.action === Share.dismissedAction) {
            // dismissed
        }
    } catch (error) {
        console.error('Error sharing:', error.message);
    }
};

const shareLink = async (url) => {
    console.log('share Link', url)
    try {
        const result = await Share.share({
            message: url,
        });

        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                console.log('Shared with activity type:', result.activityType);
            } else {
                console.log('Shared successfully');
            }
        } else if (result.action === Share.dismissedAction) {
            console.log('Dismissed');
        }
    } catch (error) {
        console.error('Error sharing link:', error.message);
    }
};

// Request permission (only Android < 10 needs it)
const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;

    if (Platform.Version < 29) {
        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);

        return (
            granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
        );
    }
    return true;
};

const downloadPDF = async (url, filename = 'terms-and-conditions.pdf') => {
    const { LABELS } = STRINGS;
    try {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'Storage permission is required to download the file.');
            return;
        }

        let path = '';

        if (Platform.OS === 'android') {
            if (Platform.Version >= 29) {
                // Android 10+ → Use Downloads folder without permission
                path = `${RNFS.DownloadDirectoryPath}/${filename}`;
            } else {
                // Android 9 and below
                path = `${RNFS.DownloadDirectoryPath}/${filename}`;
            }
        } else {
            // iOS
            path = `${RNFS.DocumentDirectoryPath}/${filename}`;
        }

        // Download file
        const options = { fromUrl: url, toFile: path };
        const download = await RNFS.downloadFile(options).promise;

        if (download.statusCode === 200) {
            showCustomToast(LABELS.success, 'File downloaded successfully.');

            try {
                await FileViewer.open(path, {
                    showOpenWithDialog: true,
                    type: 'application/pdf',
                });
            } catch (error) {
                showCustomToast(LABELS.error,
                    'No PDF Viewer Found. Please install a PDF reader to open this file.'
                );
            }
        } else {
            showCustomToast(LABELS.error, 'Could not download the file.');
        }
    } catch (err) {
        console.error('Download error:', err);
        showCustomToast(LABELS.error, 'Something went wrong while downloading.');
    }
};

const pickCsvFile = async () => {
    const { LABELS } = STRINGS;
    try {
        const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.allFiles],
            // type: [
            //     'text/csv',
            //     'text/comma-separated-values',
            //     'application/vnd.ms-excel',
            //     'application/octet-stream'
            // ], // restrict to CSV
        });
        // check extension manually
        if (res[0].name.endsWith('.csv')) {
            // res is an array, we return the first file
            return {
                uri: res[0].uri,
                type: res[0].type,
                name: res[0].name,
                size: res[0].size,
            };
        } else {
            // showCustomToast(LABELS.error, 'Please select a CSV file');
        }
    } catch (err) {
        if (DocumentPicker.isCancel(err)) {
            console.log('User cancelled file picker');
            return null;
        } else {
            throw err;
        }
    }
};

const styles = StyleSheet.create({
    toastContainer: {
        flex: 1,
        // position: 'absolute',
        bottom: Platform.select({ android: 60, ios: 30 }),
        // left: 20,
        // right: 20,
        padding: 14,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        alignItems: 'center',
        borderWidth: 1,
        // zIndex: 1000,
    },
    successToastText: {
        color: COLORS.green,
        fontSize: 14,
        flexShrink: 1, // prevents overflow
        flex: 1,
    },
    errorToastText: {
        color: COLORS.red,
        fontSize: 14,
        flexShrink: 1,
        flex: 1,
    },
    successContainer: {
        backgroundColor: COLORS.green10,
        borderColor: COLORS.green20,
    },
    errorContainer: {
        backgroundColor: COLORS.red10,
        borderColor: COLORS.red20,
    },
});

export {
    trimText,
    showError,
    showSuccess,
    showCustomToast,
    getStatusList,
    getCurrentLocation,
    inviteFriend,
    shareLink,
    downloadPDF,
    pickCsvFile,
}