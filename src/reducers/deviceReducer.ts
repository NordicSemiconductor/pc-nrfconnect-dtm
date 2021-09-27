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
        },
        deviceReady(state) {
            state.isReady = true;
        },
        dtmInit(state, action) {
            state.dtm = action.payload;
        },
        dtmBoardSelected(state, action) {
            state.board = action.payload;
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
} = deviceSlice.actions;

const getSerialNumber = (state: RootState) => state.app.device.serialNumber;
const getDtm = (state: RootState) => state.app.device.dtm;
const getBoard = (state: RootState) => state.app.device.board;
const getIsReady = (state: RootState) => state.app.device.isReady;

export {
    deviceSelected,
    deviceDeselected,
    deviceReady,
    dtmInit,
    dtmBoardSelected,
    getSerialNumber,
    getDtm,
    getBoard,
    getIsReady,
};
