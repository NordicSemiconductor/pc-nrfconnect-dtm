/*
 * Copyright (c) 2021 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { DtmPhysicalLayer } from '../dtm/types';
import * as Constants from './constants';

const defaultDevice = {
    phy: {
        PHY_LE_1M: DtmPhysicalLayer['LE 1Mbps'],
        PHY_LE_2M: DtmPhysicalLayer['LE 2Mbps'],
        PHY_LE_CODED_S8: DtmPhysicalLayer['LE Coded S8'],
        PHY_LE_CODED_S2: DtmPhysicalLayer['LE Coded S2'],
    },
    txPower: Constants.dbmValues,
};

const nRF52832 = {
    phy: {
        PHY_LE_1M: DtmPhysicalLayer['LE 1Mbps'],
        PHY_LE_2M: DtmPhysicalLayer['LE 2Mbps'],
    },
    txPower: Constants.dbmValues.filter(tx => tx <= 4),
};

const nRF52840 = { ...defaultDevice };

const nRF54L15 = {
    ...defaultDevice,
    txPower: Constants.dbmValues.filter(tx => tx >= -8),
};

function fromPCA(board: string | null) {
    switch (board) {
        case 'PCA10056':
            return nRF52840;
        case 'PCA10040':
            return nRF52832;
        case 'PCA10156':
            return nRF54L15;
        default:
            return defaultDevice;
    }
}

export { nRF52832, nRF52840, fromPCA };
