/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { createSlice } from '@reduxjs/toolkit';

import { RootState, WarningState } from './types';

const initialState: WarningState = {
    communicationError: '',
};

const warningSlice = createSlice({
    name: 'warning',
    initialState,
    reducers: {
        communicationError(state, action) {
            state.communicationError = action.payload;
        },
        clearAllWarnings(state) {
            state.communicationError = '';
        },
    },
});

export default warningSlice.reducer;

const { communicationError, clearAllWarnings } = warningSlice.actions;

const getCommunicationError = (state: RootState) =>
    state.app.warning.communicationError;

export { communicationError, clearAllWarnings, getCommunicationError };
