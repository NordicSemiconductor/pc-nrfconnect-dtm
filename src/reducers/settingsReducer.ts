/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { bleChannels } from '@nordicsemiconductor/pc-nrfconnect-shared';
import { createSlice } from '@reduxjs/toolkit';
import { DTM } from 'nrf-dtm-js/src/DTM';

import * as Constants from '../utils/constants';
import { RootState, SettingsState } from './types';

export const DTM_CHANNEL_MODE = {
    single: 'DTM_CHANNEL_MODE_SINGLE_ACTION',
    sweep: 'DTM_CHANNEL_MODE_SWEEP_ACTION',
};

const initialState: SettingsState = {
    channelMode: DTM_CHANNEL_MODE.single,
    singleChannel: 17,
    channelRange: [bleChannels[0], bleChannels[bleChannels.length - 1]],
    sweepTime: 0,
    bitpattern: 0,
    length: 37,
    txPower: Math.max(0, Constants.dbmValues.indexOf(0)),
    phy: DTM.DTM_PARAMETER.PHY_LE_1M,
    modulationMode: DTM.DTM_PARAMETER.STANDARD_MODULATION_INDEX,
    timeoutms: 0,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        dtmChannelModeChanged(state, action) {
            state.channelMode = action.payload;
        },
        dtmSingleChannelChanged(state, action) {
            state.singleChannel = action.payload;
        },
        channelRangeChanged(state, action) {
            state.channelRange = action.payload;
        },
        sweepTimeChanged(state, action) {
            state.sweepTime = action.payload;
        },
        txPowerChanged(state, action) {
            state.txPower = action.payload;
        },
        bitpatternChanged(state, action) {
            state.bitpattern = action.payload;
        },
        lengthChanged(state, action) {
            state.length = action.payload;
        },
        timeoutChanged(state, action) {
            state.timeoutms = action.payload * 1000;
        },
        phyChanged(state, action) {
            state.phy = action.payload;
        },
        modulationChanged(state, action) {
            state.modulationMode = action.payload;
        },
    },
});

export default settingsSlice.reducer;

const {
    dtmChannelModeChanged,
    dtmSingleChannelChanged,
    channelRangeChanged,
    sweepTimeChanged,
    txPowerChanged,
    bitpatternChanged,
    lengthChanged,
    timeoutChanged,
    phyChanged,
    modulationChanged,
} = settingsSlice.actions;

const getChannelMode = (state: RootState) => state.app.settings.channelMode;
const getSingleChannel = (state: RootState) => state.app.settings.singleChannel;
const getChannelRange = (state: RootState) => state.app.settings.channelRange;
const getSweepTime = (state: RootState) => state.app.settings.sweepTime;
const getBitpattern = (state: RootState) => state.app.settings.bitpattern;
const getLength = (state: RootState) => state.app.settings.length;
const getTxPower = (state: RootState) => state.app.settings.txPower;
const getPhy = (state: RootState) => state.app.settings.phy;
const getModulation = (state: RootState) => state.app.settings.modulationMode;
const getTimeout = (state: RootState) => state.app.settings.timeoutms;

export {
    dtmChannelModeChanged,
    dtmSingleChannelChanged,
    channelRangeChanged,
    sweepTimeChanged,
    txPowerChanged,
    bitpatternChanged,
    lengthChanged,
    timeoutChanged,
    phyChanged,
    modulationChanged,
    getChannelMode,
    getSingleChannel,
    getChannelRange,
    getSweepTime,
    getBitpattern,
    getLength,
    getTxPower,
    getPhy,
    getModulation,
    getTimeout,
};
