/*
 * Copyright (c) 2021 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { NrfConnectState } from 'pc-nrfconnect-shared';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

export interface DeviceState {
    board: string | null;
    isReady: boolean;
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

export type Mode = 'transmitter' | 'receiver';

export interface TestState {
    mode?: Mode;
    lastReceived: Array<number>;
    currentChannel: number | undefined;
    lastChannel: {
        channel: number;
        received: number;
    };
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
