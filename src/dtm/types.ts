/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

export enum ChannelMode {
    single = 'DTM_CHANNEL_MODE_SINGLE_ACTION',
    sweep = 'DTM_CHANNEL_MODE_SWEEP_ACTION',
}

export enum DtmPhysicalLayer {
    'LE 1Mbps' = 0x01,
    'LE 2Mbps',
    'LE Coded S8',
    'LE Coded S2',
}

export enum DtmModulationMode {
    'Standard' = 0x00,
    'Stable',
}

// 2 bits
export enum DtmPacketType {
    'PRBS9' = 0x00,
    '_11110000',
    '_10101010',
    'Constant carrier',
}
