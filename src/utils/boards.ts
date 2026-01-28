/*
 * Copyright (c) 2021 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { DtmPhysicalLayer } from '../dtm/types';

const defaultDevice = {
    phy: {
        PHY_LE_1M: DtmPhysicalLayer['LE 1Mbps'],
        PHY_LE_2M: DtmPhysicalLayer['LE 2Mbps'],
        PHY_LE_CODED_S8: DtmPhysicalLayer['LE Coded S8'],
        PHY_LE_CODED_S2: DtmPhysicalLayer['LE Coded S2'],
    },
};

const nRF52832 = {
    phy: {
        PHY_LE_1M: DtmPhysicalLayer['LE 1Mbps'],
        PHY_LE_2M: DtmPhysicalLayer['LE 2Mbps'],
    },
};

export function fromPCA(board: string | null) {
    switch (board) {
        case 'PCA10040':
            return nRF52832;
        default:
            return defaultDevice;
    }
}
