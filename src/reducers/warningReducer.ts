/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { createSlice } from '@reduxjs/toolkit';

import { RootState, WarningState } from './types';

const initialState: WarningState = {
    compatibleDeviceWarning: '',
    communicationError: '',
};

const warningSlice = createSlice({
    name: 'warning',
    initialState,
    reducers: {
        incompatibleDevice(state, action) {
            state.compatibleDeviceWarning = action.payload;
        },
        communicationError(state, action) {
            state.communicationError = action.payload;
        },
        clearAllWarnings(state) {
            state.compatibleDeviceWarning = '';
            state.communicationError = '';
        },
    },
});

export default warningSlice.reducer;

const { incompatibleDevice, communicationError, clearAllWarnings } =
    warningSlice.actions;

const getCompatibleDeviceWarning = (state: RootState) =>
    state.app.warning.compatibleDeviceWarning;
const getCommunicationError = (state: RootState) =>
    state.app.warning.communicationError;

export {
    incompatibleDevice,
    communicationError,
    clearAllWarnings,
    getCompatibleDeviceWarning,
    getCommunicationError,
};
