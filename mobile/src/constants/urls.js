import { supabaseUrl, apiRootStaging,baseUrlApi } from '@env'

export const staging = false;
export const EXTERNAL_BASE_URL_API = baseUrlApi;
export const API_BASE_URL = !staging ? supabaseUrl : apiRootStaging;
export const API_BASE_URL_WITH_REST = API_BASE_URL + '/rest/v1';
// export const getApiUrl = (endpoint) => "http://10.1.1.14:3012/api" + endpoint
export const getApiUrl = (endpoint) => API_BASE_URL_WITH_REST + endpoint
export const getExternalApiUrl = (endpoint) => EXTERNAL_BASE_URL_API + endpoint

//Get
export const GET_AVATARS_LIST = getApiUrl('/avatars');
export const GET_ICONS_LIST = getApiUrl('/icons');
export const GET_USER_LIST = getApiUrl('/rpc/get_user_lists');
export const GET_USER_LIST_WITH_ITEM_COUNT = getApiUrl('/rpc/get_user_list_with_items_count');
export const GET_ITEM_DETAIL_LIST_BY_LIST_ID = getApiUrl('/items?list_id=eq');
export const GET_ITEM_DETAIL_BY_ID = getApiUrl('/items?id=eq');
export const GET_LATEST_ADDED_ITEM = getApiUrl('/items?limit=1&order=created_at.desc&select=*,lists(id,label,icon)');

//Post
export const ADD_LISTS = getApiUrl('/lists');
export const LIST_BY_ID = getApiUrl('/lists?id=eq');
export const ADD_ITEM = getApiUrl('/items');
export const ITEM_BY_ID = getApiUrl('/items?id=eq');
export const PROFILE_DETAILS = getApiUrl('/profiles');
export const PROFILE_BY_ID = getApiUrl('/profiles?id=eq');
export const SEARCH_ITEMS = getApiUrl('/items');

//external apis
export const BOOKS = getExternalApiUrl('/get-books');
export const MOVIES = getExternalApiUrl('/get-movies');
export const BEERS = getExternalApiUrl('/get-beers');
export const TV_SHOWS = getExternalApiUrl('/get-tv-shows');
export const RESTAURANTS = getExternalApiUrl('/get-restaurants');
export const PODCASTS = getExternalApiUrl('/get-podcasts');
export const PODCASTS_EPISODES = getExternalApiUrl('/get-episodes');
// export const PODCASTS_EPISODES = getExternalApiUrl('/get-podcast-episodes');
export const BOURBONS = getExternalApiUrl('/get-bourbons');
export const WINES = getExternalApiUrl('/get-wines');
// console.log('BOOKS',BOOKS)