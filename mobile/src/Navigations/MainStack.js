import React from 'react';

import TabRoutes from './TabRoutes';
import { ChangePasswordScreen, EditItemScreen, ItemDetailsScreen, ListDetailsScreen, ProfileScreen, ROUTES } from '..';

export default function (Stack) {
    return (
        <>
            <Stack.Screen
                name={ROUTES.main}
                component={TabRoutes}
            />

            <Stack.Screen name={ROUTES.profileScreen} component={ProfileScreen} />
            <Stack.Screen name={ROUTES.changePasswordScreen} component={ChangePasswordScreen} />
            <Stack.Screen name={ROUTES.listDetailsScreen} component={ListDetailsScreen} />
            <Stack.Screen name={ROUTES.itemDetailsScreen} component={ItemDetailsScreen} />
            <Stack.Screen name={ROUTES.editItemScreen} component={EditItemScreen} />
        </>
    )
}