/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { createSlice } from '@reduxjs/toolkit';

import { DeviceState, RootState } from './types';

const initialState: DeviceState = {
    serialNumber: null,
    dtm: null,
    board: null,
    isReady: false,
    serialports: [],
    selectedSerialport: null,
};

const deviceSlice = createSlice({
    name: 'device',
    initialState,
    reducers: {
        deviceSelected(state, action) {
            state.serialNumber = action.payload;
        },
        deviceDeselected(state) {
            state.isReady = initialState.isReady;
            state.serialports = [];
            state.dtm = null;
        },
        deviceReady(state) {
            state.isReady = true;
        },
        dtmInit(state, action) {
            state.dtm = action.payload;
        },
        dtmBoardSelected(state, action) {
            state.board = action.payload.board;
            state.serialports = action.payload.serialports;
        },
        serialportSelected(state, action) {
            state.selectedSerialport = action.payload;
        },
    },
});

export default deviceSlice.reducer;

const {
    deviceSelected,
    deviceDeselected,
    deviceReady,
    dtmInit,
    dtmBoardSelected,
    serialportSelected,
} = deviceSlice.actions;

const getSerialNumber = (state: RootState) => state.app.device.serialNumber;
const getDtm = (state: RootState) => state.app.device.dtm;
const getBoard = (state: RootState) => state.app.device.board;
const getIsReady = (state: RootState) => state.app.device.isReady;
const getSerialports = (state: RootState) => state.app.device.serialports;
const getSelectedSerialport = (state: RootState) =>
    state.app.device.selectedSerialport;

export {
    deviceSelected,
    deviceDeselected,
    deviceReady,
    dtmInit,
    dtmBoardSelected,
    serialportSelected,
    getSerialNumber,
    getDtm,
    getBoard,
    getIsReady,
    getSerialports,
    getSelectedSerialport,
};
