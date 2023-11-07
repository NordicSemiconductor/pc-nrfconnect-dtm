/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { currentPane } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { RootState } from '../reducers/types';

export const TRANSMITTER = 0;
export const RECEIVER = 1;

export const isTransmitterPane = (state: RootState) =>
    currentPane(state) === TRANSMITTER;

export const paneName = (state: RootState) =>
    isTransmitterPane(state) ? 'transmitter' : 'receiver';
