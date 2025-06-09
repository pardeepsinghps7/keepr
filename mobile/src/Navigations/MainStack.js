import React from 'react';

import TabRoutes from './TabRoutes';
import { ROUTES } from '..';

export default function (Stack) {
    return (
        <>
            <Stack.Screen
                name={ROUTES.main}
                component={TabRoutes}
            />
        </>
    )
}