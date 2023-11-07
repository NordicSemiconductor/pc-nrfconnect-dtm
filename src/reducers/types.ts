/*
 * Copyright (c) 2021 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { NrfConnectState } from '@nordicsemiconductor/pc-nrfconnect-shared';

export interface DeviceState {
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
