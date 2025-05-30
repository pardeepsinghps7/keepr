import React from 'react';

import {
    Login,
    LoginScreen,
    ROUTES,
} from '../'

export default function (Stack) {
    return (
        <>
            <Stack.Screen
                name={ROUTES.login}
                component={LoginScreen}
            />
        </>
    )
}