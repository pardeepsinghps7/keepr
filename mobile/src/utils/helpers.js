// Helper functions
import { Image, StyleSheet, Text, View, Platform } from "react-native";
import { showMessage } from "react-native-flash-message";
import imagesPath from "../constants/images";
import COLORS from "../constants/colors";
import Icon from 'react-native-vector-icons/Ionicons';
import { STRINGS } from "../constants/strings";

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
}