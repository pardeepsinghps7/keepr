import types from "../types";

const initial_state = {
    appLanguage: 'en',
    medicalSpeciality: [],
    languagesList: [],
}

export default function (state = initial_state, action) {
    switch (action.type) {
        case types.MEDICAL_SPECIALITY_LIST:
            const data = action.payload
            return { ...state, medicalSpeciality: data }
        case types.LANGUAGE_LIST:
            const languages = action.payload
            return { ...state, languagesList: languages }
        case types.CHANGE_APP_LANGUAGE:
            const language = action.payload
            return { ...state, appLanguage: language }
        case types.CLEAR_REDUX_STATE:
            return { ...state, medicalSpeciality: [], languagesList: [] }
        default:
            return { ...state }
    }
}