/* Copyright (c) 2015 - 2021, Nordic Semiconductor ASA
 *
 * All rights reserved.
 *
 * Use in source and binary forms, redistribution in binary form only, with
 * or without modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions in binary form, except as embedded into a Nordic
 *    Semiconductor ASA integrated circuit in a product or a software update for
 *    such product, must reproduce the above copyright notice, this list of
 *    conditions and the following disclaimer in the documentation and/or other
 *    materials provided with the distribution.
 *
 * 2. Neither the name of Nordic Semiconductor ASA nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * 3. This software, with or without modification, must only be used with a Nordic
 *    Semiconductor ASA integrated circuit.
 *
 * 4. Any software provided in binary form under this license must not be reverse
 *    engineered, decompiled, modified and/or disassembled.
 *
 * THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { createSlice } from '@reduxjs/toolkit';

import { RootState, TestState } from './types';

const InitialState: TestState = {
    isRunning: false,
    lastStatusMessage: '',
    lastReceived: new Array(40).fill(0),
    currentChannel: undefined,
    lastChannel: { channel: 0, received: 0 },
    update: 0,
};

const testSlice = createSlice({
    name: 'test',
    initialState: InitialState,
    reducers: {
        startedAction(state) {
            state.isRunning = true;
            state.lastStatusMessage = 'Running test';
            state.lastReceived = new Array(40).fill(0);
            state.update += 1;
        },
        stoppedAction(state) {
            state.isRunning = false;
            state.update += 1;
        },
        actionSucceeded(state, action) {
            state.lastReceived = action.payload;
            state.lastStatusMessage = 'Test ended successfully';
            state.isRunning = false;
            state.update += 1;
        },
        actionFailed(state, action) {
            state.lastStatusMessage = action.payload;
            state.update += 1;
        },
        startedChannel(state, action) {
            state.currentChannel = action.payload;
            state.update += 1;
        },
        resetChannel(state) {
            state.currentChannel = undefined;
            state.update += 1;
        },
        endedChannel(state, action) {
            const { channel, received } = action.payload;
            const packets = received === undefined ? 0 : received;
            const nextReceivedCount = [...state.lastReceived];
            nextReceivedCount[channel] += packets;
            state.lastChannel = { channel, received: packets };
            state.lastReceived = nextReceivedCount;
            state.update += 1;
        },
    },
});

export default testSlice.reducer;

const {
    startedAction,
    stoppedAction,
    actionSucceeded,
    actionFailed,
    startedChannel,
    resetChannel,
    endedChannel,
} = testSlice.actions;

const getIsRunning = (state: RootState) => state.app.test.isRunning;
const getLastStatusMessage = (state: RootState) =>
    state.app.test.lastStatusMessage;
const getLastReceived = (state: RootState) => state.app.test.lastReceived;
const getCurrentChannel = (state: RootState) => state.app.test.currentChannel;
const getLastChannel = (state: RootState) => state.app.test.lastChannel;
const getUpdate = (state: RootState) => state.app.test.update;

export {
    startedAction,
    stoppedAction,
    actionSucceeded,
    actionFailed,
    startedChannel,
    resetChannel,
    endedChannel,
    getIsRunning,
    getLastStatusMessage,
    getLastReceived,
    getCurrentChannel,
    getLastChannel,
    getUpdate,
};
