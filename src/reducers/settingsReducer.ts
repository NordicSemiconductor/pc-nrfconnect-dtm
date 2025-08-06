/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { bleChannels } from '@nordicsemiconductor/pc-nrfconnect-shared';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
    ChannelMode,
    DtmModulationMode,
    DtmPacketType,
    DtmPhysicalLayer,
} from '../dtm/types';
import { deviceDeselected } from './deviceReducer';
import { RootState, SettingsState } from './types';

const initialState: SettingsState = {
    channelMode: ChannelMode.single,
    singleChannel: 17,
    channelRange: [bleChannels[0], bleChannels[bleChannels.length - 1]],
    sweepTime: 0,
    bitpattern: 0,
    length: 37,
    txPower: 0,
    phy: DtmPhysicalLayer['LE 1Mbps'],
    modulationMode: DtmModulationMode.Standard,
    timeoutms: 0,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        dtmChannelModeChanged(state, action: PayloadAction<ChannelMode>) {
            state.channelMode = action.payload;
        },
        dtmSingleChannelChanged(state, action: PayloadAction<number>) {
            state.singleChannel = action.payload;
        },
        channelRangeChanged(state, action: PayloadAction<[number, number]>) {
            state.channelRange = action.payload;
        },
        sweepTimeChanged(state, action: PayloadAction<number>) {
            state.sweepTime = action.payload;
        },
        txPowerChanged(state, action: PayloadAction<number>) {
            state.txPower = action.payload;
        },
        bitpatternChanged(state, action: PayloadAction<DtmPacketType>) {
            state.bitpattern = action.payload;
        },
        lengthChanged(state, action: PayloadAction<number>) {
            state.length = action.payload;
        },
        timeoutChanged(state, action: PayloadAction<number>) {
            state.timeoutms = action.payload * 1000;
        },
        phyChanged(state, action: PayloadAction<DtmPhysicalLayer>) {
            state.phy = action.payload;
        },
        modulationChanged(state, action: PayloadAction<DtmModulationMode>) {
            state.modulationMode = action.payload;
        },
    },
    extraReducers: builder => {
        builder.addCase(deviceDeselected, () => initialState);
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
