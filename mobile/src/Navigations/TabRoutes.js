import React, { useContext, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { Image, Platform, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import actions from '../redux/actions';
import { ROUTES, STRINGS } from '../constants/strings';
import imagesPath from '../constants/images';
import UpdatePasswordScreen from '../screens/auth/UpdatePasswordScreen';
import HomeScreen from '../screens/main/HomeScreen';
import COLORS from '../constants/colors';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import QuickAddItemScreen from '../screens/main/QuickAddItemScreen';
import { AddScreen, ChangePasswordScreen, EditItemScreen, ItemDetailsScreen, ListDetailsScreen, ListsScreen, ProfileScreen } from '../index.js';

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();


// --- Reusable Shared Stack (for Home, Lists, Add)
function SharedStack({ initialRouteName, component: MainComponent }) {
  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={initialRouteName} component={MainComponent} />
      <Stack.Screen name={ROUTES.quickAdd} component={QuickAddItemScreen} />
      <Stack.Screen name={ROUTES.listDetailsScreen} component={ListDetailsScreen} />
      <Stack.Screen name={ROUTES.itemDetailsScreen} component={ItemDetailsScreen} />
      <Stack.Screen name={ROUTES.editItemScreen} component={EditItemScreen} />
      <Stack.Screen name={ROUTES.profileScreen} component={ProfileScreen} />
      <Stack.Screen name={ROUTES.changePasswordScreen} component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
}

const TabRoutes = () => {
  const { LABELS } = STRINGS
  const loginType = useSelector((state) => state.auth.loginType)
  const isDemo = useSelector((state) => state.auth.isDemo)
  const [state, setState] = useState({
    modalVisible: false
  })
  const updateState = (data) => setState(() => ({ ...state, ...data }))
  console.log('hey', loginType)

  const DisabledTabButton = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => { }}>
      <View style={{ marginTop: 4, alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <BottomTab.Navigator
      initialRouteName={ROUTES.mainHome}
      screenOptions={{
        tabBarInactiveTintColor: COLORS.text_secondary,
        tabBarActiveTintColor: COLORS.accent,
        headerShown: false,
        tabBarLabelStyle: {
          height: Platform.select({ android: 18 }),
          fontSize: 14,
        },
        tabBarStyle: {
          backgroundColor: COLORS.white,
          height: Platform.select({ android: '9%', ios: '9%' }),
        },
      }}
    >
      <BottomTab.Screen
        name={ROUTES.mainHome}
        // component={HomeStackNavigator}
        children={() => <SharedStack initialRouteName={ROUTES.home} component={HomeScreen} />}
        options={{
          tabBarLabel: ROUTES.home,
          tabBarIcon: ({ color, size }) => (
            <Image source={imagesPath.home} style={styles.iconWrapper(color, size)} />
          ),
        }}
      />
      <BottomTab.Screen
        name={ROUTES.mainAdd}
        // component={AddStackNavigator}
        children={() => <SharedStack initialRouteName={ROUTES.add} component={AddScreen} />}
        options={{
          tabBarLabel: ROUTES.add,
          tabBarIcon: ({ color, size }) => (
            <Image source={imagesPath.add} style={styles.iconWrapper(color, size)} />
          ),
        }}
      />
      <BottomTab.Screen
        name={ROUTES.mainLists}
        // component={ListStackNavigator}
        children={() => <SharedStack initialRouteName={ROUTES.lists} component={ListsScreen} />}
        options={{
          tabBarLabel: ROUTES.lists,
          tabBarIcon: ({ color, size }) => (
            <Image source={imagesPath.lists} style={styles.iconWrapper(color, size)} />
          ),
          // tabBarBadge: 3,
        }}
      />
      <BottomTab.Screen
        name={ROUTES.share}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: COLORS.borderGray }}>{ROUTES.share}</Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              source={imagesPath.share}
              style={styles.iconWrapper(COLORS.borderGray)}
            />
          ),
          tabBarButton: (props) => <DisabledTabButton {...props} />,
        }}
      >
        {() => null}
      </BottomTab.Screen>

      <BottomTab.Screen
        name={ROUTES.discover}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: COLORS.borderGray }}>{ROUTES.discover}</Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              source={imagesPath.discover}
              style={styles.iconWrapper(COLORS.borderGray)}
            />
          ),
          tabBarButton: (props) => <DisabledTabButton {...props} />,
        }}
      >
        {() => null}
      </BottomTab.Screen>
    </BottomTab.Navigator>
  );
}

export default TabRoutes

const styles = StyleSheet.create({
  iconWrapper: (color, size) => ({
    width: 20, //size
    height: 20, //size
    tintColor: color,
    resizeMode: 'contain',
  })
})