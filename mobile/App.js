import React, { useEffect } from 'react';
import FlashMessage from 'react-native-flash-message';
import 'react-native-url-polyfill/auto';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import Routes from './src/Navigations/Route';
import { getUserData } from './src/utils/utils';
import { saveUserData } from './src/redux/actions/auth';
import { logoutSupabase, refreshSupabaseToken } from './src';
import actions from './src/redux/actions';

const App = () => {
  useEffect(() => {
    init();
  }, [])

  const init = async () => {
    // refreshSupabaseToken();
    const userData = await getUserData();
    if (!!userData) {
      saveUserData(userData)
    }
    // await logoutSupabase();
    // actions.logout();
  }
  return (
    <Provider store={store}>
      <FlashMessage position="bottom" floating={true}/>
      <Routes />
    </Provider>
  );
}

export default App;
