/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { createSlice } from '@reduxjs/toolkit';

import { DeviceState, RootState } from './types';

const initialState: DeviceState = {
    board: null,
    isReady: false,
};

const deviceSlice = createSlice({
    name: 'device',
    initialState,
    reducers: {
        deviceDeselected(state) {
            state.isReady = initialState.isReady;
        },
        deviceReady(state) {
            state.isReady = true;
        },
        dtmBoardSelected(state, action) {
            state.board = action.payload;
        },
    },
});

export default deviceSlice.reducer;

const { deviceDeselected, deviceReady, dtmBoardSelected } = deviceSlice.actions;

const getBoard = (state: RootState) => state.app.device.board;
const getIsReady = (state: RootState) => state.app.device.isReady;

export {
    deviceDeselected,
    deviceReady,
    dtmBoardSelected,
    getBoard,
    getIsReady,
};
