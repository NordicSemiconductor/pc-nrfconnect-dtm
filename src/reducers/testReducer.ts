/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { deviceDeselected } from './deviceReducer';
import { Mode, RootState, TestState } from './types';

const initialState: TestState = {
    lastReceived: new Array(40).fill(0),
    currentChannel: undefined,
    lastChannel: { channel: 0, received: 0 },
};

const testSlice = createSlice({
    name: 'test',
    initialState,
    reducers: {
        startedAction(state, { payload: mode }: PayloadAction<Mode>) {
            state.mode = mode;
            state.lastReceived = new Array(40).fill(0);
        },
        actionSucceeded(state, action) {
            state.lastReceived = action.payload;
            state.mode = undefined;
        },
        startedChannel(state, action) {
            state.currentChannel = action.payload;
        },
        resetChannel(state) {
            state.currentChannel = undefined;
        },
        endedChannel(state, action) {
            const { channel, received } = action.payload;
            const packets = received === undefined ? 0 : received;
            const nextReceivedCount = [...state.lastReceived];
            nextReceivedCount[channel] += packets;
            state.lastChannel = { channel, received: packets };
            state.lastReceived = nextReceivedCount;
        },
    },
    extraReducers: builder => {
        builder.addCase(deviceDeselected, state => {
            state.mode = undefined;
        });
    },
});

export default testSlice.reducer;

const {
    startedAction,
    actionSucceeded,
    startedChannel,
    resetChannel,
    endedChannel,
} = testSlice.actions;

const getIsRunning = (state: RootState) => state.app.test.mode != null;
const getIsInTransmitterMode = (state: RootState) =>
    state.app.test.mode === 'transmitter';
const getIsInReceiverMode = (state: RootState) =>
    state.app.test.mode === 'receiver';
const getMode = (state: RootState) => state.app.test.mode;
const getLastReceived = (state: RootState) => state.app.test.lastReceived;
const getCurrentChannel = (state: RootState) => state.app.test.currentChannel;
const getLastChannel = (state: RootState) => state.app.test.lastChannel;

export {
    startedAction,
    actionSucceeded,
    startedChannel,
    resetChannel,
    endedChannel,
    getIsRunning,
    getIsInTransmitterMode,
    getIsInReceiverMode,
    getMode,
    getLastReceived,
    getCurrentChannel,
    getLastChannel,
};
