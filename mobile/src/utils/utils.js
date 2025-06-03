import { supabaseKey, supabaseUrl } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../redux/store';
import types from '../redux/types';
import constants from '../constants/constants';
import NetInfo from '@react-native-community/netinfo';
import pluralize from 'pluralize';

const { dispatch, getState } = store;

export async function getHeaders() {
	let token = await AsyncStorage.getItem(constants.TOKEN);
	console.log('token is===> ', token)
	if (token) {
		token = JSON.parse(token);
		// console.log(userData?.access_token, 'header')
		return {
			authorization: `Bearer ${token.access_token}`,
		};
	}
	return {};
}

export async function apiReq(endPoint, data, method, headers = {}, requestOptions = {}) {
	const getTokenHeader = await getHeaders();
	const isMultipart = data instanceof FormData;

	headers = {
		...headers,
		...getTokenHeader,
		...(isMultipart ? { "Content-Type": "multipart/form-data" } : {}),
		apikey: supabaseKey,
		// Connection: 'close', // Remove unless required
	};

	const netState = await NetInfo.fetch();
	if (!netState.isConnected) {
		throw { code: 506, message: "Please check your connection and try again.", msg: "Please check your connection and try again." };
	}

	try {
		const response = await axios({
			method,
			url: endPoint,
			headers,
			// timeout: 10000,
			...(method.toLowerCase() === 'get' ? { params: data } : { data }),
			...requestOptions,
		});

		if (response.data.status === false) {
			throw response.data;
		}
		return response.data;
	} catch (error) {
		if (error?.response?.status === 401) {
			clearUserData();
			dispatch({ type: types.CLEAR_REDUX_STATE, payload: {} });
			dispatch({ type: types.NO_INTERNET, payload: { internetConnection: true } });
			throw { message: "Token expired. Kindly login again.", msg: "Token expired. Kindly login again." };
		}
		// else if (error.code === 'ECONNABORTED') {
		// 	throw { message: 'Request timed out. Please try again.', msg: 'Request timed out. Please try again.' };
		// }
		throw {
			message: error?.response?.data?.message || error.message || "Network Error",
			msg: error?.response?.data?.message || error.message || "Network Error",
		};
	}
}



export function apiPost(endPoint, data, headers = {}) {
	return apiReq(endPoint, data, 'post', headers);
}

export function apiDelete(endPoint, data, headers = {}) {
	return apiReq(endPoint, data, 'delete', headers);
}

export function apiGet(endPoint, data, headers = {}, requestOptions) {
	return apiReq(endPoint, data, 'get', headers, requestOptions);
}

export function apiPut(endPoint, data, headers = {}) {
	return apiReq(endPoint, data, 'put', headers);
}
export function apiPatch(endPoint, data, headers = {}) {
	return apiReq(endPoint, data, 'patch', headers);
}

export function setItem(key, data) {
	data = JSON.stringify(data);
	return AsyncStorage.setItem(key, data);
}

export function getItem(key) {
	return new Promise((resolve, reject) => {
		AsyncStorage.getItem(key).then(data => {
			resolve(JSON.parse(data));
		});
	});
}

export async function removeItem(key) {
	return AsyncStorage.removeItem(key);
}

export function clearAsyncStorate(key) {
	return AsyncStorage.clear();
}

export function setUserData(data) {
	data = JSON.stringify(data);
	return AsyncStorage.setItem('userData', data);
}

export async function getUserData() {
	return new Promise((resolve, reject) => {
		AsyncStorage.getItem('userData').then(data => {
			resolve(JSON.parse(data));
		});
	});
}
export async function clearUserData() {
	return AsyncStorage.removeItem('userData');
}

//

export function setData(key, value) {
	if (typeof value === "boolean")
		value = JSON.stringify(value);
	return AsyncStorage.setItem(key, value);
}
export const getData = async (key) => {
	const data = await AsyncStorage.getItem(key);
	return data
}

export const capitalizeEachWord = (str) => {
	if (!str || typeof str !== 'string') return '';
	return str.replace(/\b\w/g, char => char.toUpperCase()).toLowerCase()
		.replace(/(^\w{1})|(\s+\w{1})/g, match => match.toUpperCase());
}

export const toSingular = (word) => {
	if (!word) return '';
	return pluralize.singular(word);
};