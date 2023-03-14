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
    serialports: [],
    selectedSerialport: null,
};

const deviceSlice = createSlice({
    name: 'device',
    initialState,
    reducers: {
        deviceDeselected(state) {
            state.selectedSerialport = null;
            state.serialports = [];
            state.isReady = initialState.isReady;
        },
        setDeviceReady(state, action) {
            state.isReady = action.payload;
        },
        dtmBoardSelected(state, action) {
            state.board = action.payload.board;
            state.serialports = action.payload.serialports;
            state.selectedSerialport = action.payload.serialports[0] || null;
        },
        serialportSelected(state, action) {
            state.selectedSerialport = action.payload;
        },
    },
});

export default deviceSlice.reducer;

const {
    deviceDeselected,
    setDeviceReady,
    dtmBoardSelected,
    serialportSelected,
} = deviceSlice.actions;

const getBoard = (state: RootState) => state.app.device.board;
const getIsReady = (state: RootState) => state.app.device.isReady;
const getSerialports = (state: RootState) => state.app.device.serialports;
const getSelectedSerialport = (state: RootState) =>
    state.app.device.selectedSerialport;

export {
    deviceDeselected,
    setDeviceReady,
    dtmBoardSelected,
    serialportSelected,
    getBoard,
    getIsReady,
    getSerialports,
    getSelectedSerialport,
};
