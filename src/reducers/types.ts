/*
 * Copyright (c) 2021 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { NrfConnectState } from 'pc-nrfconnect-shared';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

export interface DeviceState {
    serialNumber: string | null;
    dtm: null;
    board: string | null;
    isReady: boolean;
    serialports: string[];
    selectedSerialport: string | null;
}

export interface SettingsState {
    channelMode: string;
    singleChannel: number;
    channelRange: number[];
    sweepTime: number;
    bitpattern: number;
    length: number;
    txPower: number;
    phy: number;
    modulationMode: number;
    timeoutms: number;
}

export interface TestState {
    isRunning: boolean;
    lastStatusMessage: string;
    lastReceived: Array<number>;
    currentChannel: number | undefined;
    lastChannel: {
        channel: number;
        received: number;
    };
    update: number;
}

export interface WarningState {
    compatibleDeviceWarning: string;
    communicationError: string;
}

interface AppState {
    device: DeviceState;
    settings: SettingsState;
    test: TestState;
    warning: WarningState;
}

export type RootState = NrfConnectState<AppState>;

export type TDispatch = ThunkDispatch<RootState, null, AnyAction>;
