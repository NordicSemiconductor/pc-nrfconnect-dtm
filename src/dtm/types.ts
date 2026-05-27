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
    // Nordic proprietary 4 Mbps PHYs (vendor extension). The value is the DTM
    // 2-wire PHY parameter; the device places it in bits [7:2], so 0x05 → 0x14
    // and 0x06 → 0x18 on the wire (see slx_dtm dtm_uart_twowire.c).
    '4 Mbps BT=0.6',
    '4 Mbps BT=0.4',
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
