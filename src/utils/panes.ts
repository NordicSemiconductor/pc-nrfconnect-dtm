/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { currentPane } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { RootState } from '../reducers/types';

// todo: sync with Mode type from 'src/reducers/types.ts'
export enum Panes {
    TRANSMITTER = 'Transmitter',
    RECEIVER = 'Receiver',
}

export const isTransmitterPane = (state: RootState) =>
    currentPane(state) === Panes.TRANSMITTER;

export const isReceiverPane = (state: RootState) =>
    currentPane(state) === Panes.RECEIVER;

export const paneName = (state: RootState) =>
    isTransmitterPane(state) ? 'transmitter' : 'receiver';
