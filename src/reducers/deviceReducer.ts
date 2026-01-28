/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { createSlice } from '@reduxjs/toolkit';

import { type DeviceState, type RootState } from './types';

const initialState: DeviceState = {
    board: null,
    isReady: false,
    serialports: [],
    selectedSerialport: null,
    selectedBaudRate: 19200,
};

const deviceSlice = createSlice({
    name: 'device',
    initialState,
    reducers: {
        deviceDeselected(state) {
            state.selectedSerialport = null;
            state.serialports = [];
            state.isReady = initialState.isReady;
            state.board = initialState.board;
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
        baudRateSelected(state, action) {
            state.selectedBaudRate = action.payload;
        },
    },
});

export default deviceSlice.reducer;

const {
    deviceDeselected,
    setDeviceReady,
    dtmBoardSelected,
    serialportSelected,
    baudRateSelected,
} = deviceSlice.actions;

const getBoard = (state: RootState) => state.app.device.board;
const getIsReady = (state: RootState) => state.app.device.isReady;
const getSerialports = (state: RootState) => state.app.device.serialports;
const getSelectedSerialport = (state: RootState) =>
    state.app.device.selectedSerialport;
const getBaudRate = (state: RootState) => state.app.device.selectedBaudRate;

export {
    deviceDeselected,
    setDeviceReady,
    dtmBoardSelected,
    serialportSelected,
    baudRateSelected,
    getBoard,
    getIsReady,
    getSerialports,
    getSelectedSerialport,
    getBaudRate,
};
