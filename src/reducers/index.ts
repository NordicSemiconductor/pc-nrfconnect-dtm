/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { combineReducers } from 'redux';

import device from './deviceReducer';
import settings from './settingsReducer';
import test from './testReducer';
import warning from './warningReducer';

const rootReducer = combineReducers({
    device,
    settings,
    test,
    warning,
});

export default rootReducer;
