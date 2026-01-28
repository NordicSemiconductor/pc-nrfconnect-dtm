/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */

import React, { type FC } from 'react';
import { Provider } from 'react-redux';
import { currentPane } from '@nordicsemiconductor/pc-nrfconnect-shared';
import { render, type RenderOptions } from '@testing-library/react';
import {
    type AnyAction,
    applyMiddleware,
    combineReducers,
    createStore,
} from 'redux';
import thunk from 'redux-thunk';

import reducer from '../reducers';

const createPreparedStore = (actions: AnyAction[]) => {
    const store = createStore(
        combineReducers({ app: reducer }),
        applyMiddleware(thunk),
    );
    actions.forEach(store.dispatch);

    return store;
};

window.ResizeObserver = class {
    observe = jest.fn();
    disconnect = jest.fn();
    unobserve = jest.fn();
};

window.MutationObserver = class {
    observe = jest.fn();
    disconnect = jest.fn();
    takeRecords() {
        return [];
    }
};

const customRender = (
    element: React.ReactElement,
    actions: AnyAction[] = [],
    options: RenderOptions = {},
) => {
    const Wrapper: FC = props => (
        <Provider store={createPreparedStore(actions)} {...props} />
    );
    return render(element, { wrapper: Wrapper, ...options });
};

jest.mock('@nordicsemiconductor/pc-nrfconnect-shared', () => ({
    ...jest.requireActual('@nordicsemiconductor/pc-nrfconnect-shared'),
    currentPane: jest.fn().mockReturnValue(0),
}));
export const mockedCurrentPane = currentPane as jest.MockedFunction<
    typeof currentPane
>;

export * from '@testing-library/react';
export { customRender as render };
