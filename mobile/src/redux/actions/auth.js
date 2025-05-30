import constants from "../../constants/constants";
import { clearUserData, removeItem } from "../../utils/utils";
import store from "../store";
import types from "../types";

const { dispatch } = store

export const saveUserData = (data) => {
    dispatch({
        type: types.LOGIN,
        payload: data
    })
}

export function logout() {
    dispatch({ type: types.CLEAR_REDUX_STATE })
    removeItem(constants.TOKEN);
    clearUserData();
}