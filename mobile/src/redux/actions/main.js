import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "../../utils/utils";
import store from "../store";
import types from "../types";
import { ADD_ITEM, ADD_LISTS, BEERS, BOOKS, BOURBONS, GET_AVATARS_LIST, GET_ICONS_LIST, GET_ITEM_DETAIL_BY_ID, GET_ITEM_DETAIL_LIST_BY_LIST_ID, GET_LATEST_ADDED_ITEM, GET_USER_LIST, GET_USER_LIST_WITH_ITEM_COUNT, ITEM_BY_ID, LIST_BY_ID, MOVIES, PODCASTS, PODCASTS_EPISODES, PROFILE_BY_ID, PROFILE_DETAILS, RESTAURANTS, TV_SHOWS, WINES, } from "../../constants/urls";

const { dispatch } = store

export const saveMedicalSpecialityList = (data) => {
    dispatch({
        type: types.MEDICAL_SPECIALITY_LIST,
        payload: data
    })
}
export const saveLanguagesList = (data) => {
    dispatch({
        type: types.LANGUAGE_LIST,
        payload: data
    })
}

export function getAvatarsList() {
    return apiGet(GET_AVATARS_LIST)
}

export function getIconsList() {
    return apiGet(GET_ICONS_LIST)
}

export function getUserList() {
    return apiGet(GET_USER_LIST)
}

export function addProfileDetail(data) {
    return apiPost(PROFILE_DETAILS, data)
}

export function updateProfileDetail(id, data) {
    return apiPatch(`${PROFILE_BY_ID}.${id}`, data)
}

export function getProfileDetail() {
    return apiGet(PROFILE_DETAILS)
}

export function addList(data) {
    return apiPost(ADD_LISTS, data)
}

export function updateList(list_id, data) {
    return apiPatch(`${LIST_BY_ID}.${list_id}`, data)
}

export function deleteList(list_id) {
    return apiDelete(`${LIST_BY_ID}.${list_id}`)
}

export function addItem(data) {
    return apiPost(ADD_ITEM, data)
}

export function updateItem(item_id, data) {
    return apiPatch(`${ITEM_BY_ID}.${item_id}`, data)
}

export function deleteItem(item_id) {
    return apiDelete(`${ITEM_BY_ID}.${item_id}`)
}

export function getUserListWithItemCount() {
    return apiGet(GET_USER_LIST_WITH_ITEM_COUNT)
}

export function getLatestAddedItem() {
    return apiGet(GET_LATEST_ADDED_ITEM)
}

export function getItemListByListId(list_id) {
    return apiGet(`${GET_ITEM_DETAIL_LIST_BY_LIST_ID}.${list_id}&select=*,lists(id,label,icon)`)
}

export function getItemDetailsById(id) {
    return apiGet(`${GET_ITEM_DETAIL_BY_ID}.${id}&select=*,lists(id,label,icon)`)
}

//external apis
export function getSearchBooksList(searchText, page = 1) {
    return apiGet(`${BOOKS}?title=${searchText}&page=${page}`)
}
export function getSearchMoviesList(searchText, page = 1) {
    return apiGet(`${MOVIES}?title=${searchText}&page=${page}`)
}
export function getSearchBeerList(searchText, page = 1) {
    return apiGet(`${BEERS}?name=${searchText}&page=${page}`)
}
export function getSearchTVShowsList(searchText, page = 1) {
    return apiGet(`${TV_SHOWS}?name=${searchText}&page=${page}`)
}
export function getSearchRestaurantsList(searchText, latitude, longitude, page = 1) {
    return apiGet(`${RESTAURANTS}?name=${searchText}&latitude=${latitude || ''}&longitude=${longitude || ''}&page=${page}`)
}
export function getSearchPodcastsList(searchText, page = 1) {
    return apiGet(`${PODCASTS}?title=${searchText}&page=${page}`)
}
export function getSearchPodcastEpisodeList(searchText, seriesId = '', page = 1) {
    console.log('iddddddddd', seriesId)
    return apiGet(`${PODCASTS_EPISODES}?title=${searchText}&podcast_id=${seriesId}&page=${page}`)
}
//search for series episodes
// export function getSearchSeriesEpisodesList(searchText, next_episode_pub_date = '') {
//     return apiGet(`${PODCASTS_EPISODES}?podcast_id=${searchText}&next_episode_pub_date=${next_episode_pub_date}`)
// }
export function getSearchBourbonsList(searchText, page = 1) {
    return apiGet(`${BOURBONS}?title=${searchText}&page=${page}`)
}
export function getSearchWinesList(searchText, page = 1) {
    return apiGet(`${WINES}?title=${searchText}&page=${page}`)
}