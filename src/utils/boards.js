import { DTM } from 'nrf-dtm-js/src/DTM';

import * as Constants from './constants';

const defaultDevice = {
    phy: {
        PHY_LE_1M: DTM.DTM_PARAMETER.PHY_LE_1M,
        PHY_LE_2M: DTM.DTM_PARAMETER.PHY_LE_2M,
        PHY_LE_CODED_S8: DTM.DTM_PARAMETER.PHY_LE_CODED_S8,
        PHY_LE_CODED_S2: DTM.DTM_PARAMETER.PHY_LE_CODED_S2,
    },
    txPower: Constants.dbmValues,
};

const nRF52832 = {
    phy: {
        PHY_LE_1M: DTM.DTM_PARAMETER.PHY_LE_1M,
        PHY_LE_2M: DTM.DTM_PARAMETER.PHY_LE_2M,
    },
    txPower: Constants.dbmValues.filter(tx => tx <= 4),
};

const nRF52840 = { ...defaultDevice };

function fromPCA(board) {
    switch (board) {
        case 'PCA10056':
            return nRF52840;
        case 'PCA10040':
            return nRF52832;
        default:
            return defaultDevice;
    }
}

export { nRF52832, nRF52840, fromPCA };
