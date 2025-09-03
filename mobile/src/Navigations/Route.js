import React, { useEffect, useState, useRef } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainStack from './MainStack';
import AuthStack from './AuthStack';
import { useSelector } from 'react-redux';
import { navigationRef } from './NavigationService';
import { Linking } from 'react-native';
import {
    LoginScreen,
    SignupScreen,
    ForgotPasswordScreen,
    SplashScreen,
    Onboarding,
    RecaptchaScreen,
    ROUTES,
    UpdatePasswordScreen,
    setSession,
    showCustomToast,
    getCurrentLocation,
} from '../index.js';
import COLORS from '../constants/colors.js';

const Stack = createNativeStackNavigator();
const handledUrlsRef = new Set(); // ✅ don't mark failed URLs as handled
const deepLinkHandledRef = { current: false };

const linking = {
    prefixes: ["keepr://"], // universal + custom scheme
    config: {
        screens: {
            [ROUTES.updatePassword]: 'reset',
            [ROUTES.itemDetailsScreen]: "item/:id", // map /item/:id to ItemDetail screen
        },
    },
};

export default function Routes() {
    const [initialUrlHandled, setInitialUrlHandled] = useState(false);
    const userData = useSelector((state) => state.auth.userData);

    const handleResetLink = async (url) => {
        try {
            if (!url || handledUrlsRef.has(url)) return;
            console.log('📥 Deep link received:', url);

            const rawParams = url.includes('#') ? url.split('#')[1] : url.split('?')[1];
            const params = new URLSearchParams(rawParams);

            const access_token = params.get('access_token');
            const refresh_token = params.get('refresh_token');
            const type = params.get('type');

            if (access_token && refresh_token) {
                await setSession(access_token, refresh_token);

                // ✅ Only mark URL as handled after successful session
                handledUrlsRef.add(url);
                deepLinkHandledRef.current = true;

                if (type === 'recovery') {
                    navigationRef.current?.navigate(ROUTES.updatePassword);
                }
            }
            // 🔹 Handle item deep link with query param
            else if (url.includes('open-item')) {
                const parsedUrl = new URL(url);
                const itemId = parsedUrl.searchParams.get('id');

                if (itemId) {
                    console.log('🟢 Open Item Screen with ID:', itemId);
                    showCustomToast('success', `Item ID: ${itemId}`);
                    navigationRef.current?.navigate(ROUTES.itemDetailsScreen, {
                        item: { id: itemId, type: 'share' }
                    });
                }
            } else {
                const error = params.get('error_description');
                showCustomToast('Error', error || 'Invalid or expired link');
            }
        } catch (err) {
            console.log('❌ Error parsing deep link:', err.message);
            showCustomToast('Error', 'Failed to handle link');
        }
    };

    useEffect(() => {
        // getCurrentLocation();
        const onLink = ({ url }) => handleResetLink(url);

        const subscription = Linking.addEventListener('url', onLink);

        Linking.getInitialURL().then((url) => {
            console.log('huddsdsusfsf')
            if (url) handleResetLink(url);
            setInitialUrlHandled(true);
        });

        return () => {
            subscription.remove();
        };
    }, []);

    if (!initialUrlHandled) return null;

    const MyTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: COLORS.white,
        },
    };

    return (
        <NavigationContainer ref={navigationRef} linking={linking} theme={MyTheme}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!!userData?.access_token
                    ? MainStack(Stack)
                    : <>
                        <Stack.Screen name={ROUTES.splash} component={SplashScreen} initialParams={{ deepLinkHandledRef }} />
                        <Stack.Screen name={ROUTES.Onboarding} component={Onboarding} />
                        <Stack.Screen name={ROUTES.recaptcha} component={RecaptchaScreen} />
                        <Stack.Screen name={ROUTES.signup} component={SignupScreen} />
                        <Stack.Screen name={ROUTES.login} component={LoginScreen} />
                        <Stack.Screen name={ROUTES.forgotPassword} component={ForgotPasswordScreen} />
                        <Stack.Screen name={ROUTES.updatePassword} component={UpdatePasswordScreen} />
                    </>
                }
            </Stack.Navigator>
        </NavigationContainer>
    );
}
