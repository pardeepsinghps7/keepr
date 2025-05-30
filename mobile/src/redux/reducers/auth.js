import types from "../types";

const initial_state = {
    userData: {},
    isDemo: false,
    appLanguage: 'en',
    // appTheme: constants.LIGHT_THEME,
}

export default function (state = initial_state, action) {
    switch (action.type) {
        case types.LOGIN:
            const data = action.payload
            return { ...state, userData: data }
        case types.IS_DEMO:
            const isDemo = action.payload
            return { ...state, isDemo: isDemo }
        case types.CHANGE_APP_THEME:
            const theme = action.payload
            return { ...state, appTheme: theme }
        case types.CHANGE_APP_LANGUAGE:
            const language = action.payload
            return { ...state, appLanguage: language }
        case types.CHANGE_LOGIN_TYPE:
            const loginType = action.payload
            return { ...state, loginType: loginType }
        case types.CLEAR_REDUX_STATE:
            return { ...state, userData: {} }
        default:
            return { ...state }
    }
}