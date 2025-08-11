/*
 * Copyright (c) 2021 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { NrfConnectState } from '@nordicsemiconductor/pc-nrfconnect-shared';

import {
    ChannelMode,
    DtmModulationMode,
    DtmPacketType,
    DtmPhysicalLayer,
} from '../dtm/types';

export interface DeviceState {
    board: string | null;
    isReady: boolean;
    serialports: string[];
    selectedSerialport: string | null;
    selectedBaudRate: number;
}

export interface SettingsState {
    channelMode: ChannelMode;
    singleChannel: number;
    channelRange: [number, number];
    sweepTime: number;
    bitpattern: DtmPacketType;
    length: number;
    txPower: number;
    receivedTxPower: number;
    phy: DtmPhysicalLayer;
    modulationMode: DtmModulationMode;
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
