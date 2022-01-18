/*
 * Copyright (c) 2021 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { connect } from 'react-redux';
import path from 'path';
import {
    Device,
    DeviceSelector,
    getAppDir,
    logger,
} from 'pc-nrfconnect-shared';

import { deselectDevice, setupDtm } from './actions/testActions';
import {
    deviceDeselected,
    dtmBoardSelected,
    serialportSelected,
} from './reducers/deviceReducer';
import { TDispatch } from './reducers/types';
import { clearAllWarnings } from './reducers/warningReducer';
import { compatiblePCAs } from './utils/constants';

const deviceListing = {
    serialport: true,
    jlink: true,
};

const deviceSetup = {
    jprog: {
        pca10040: {
            fw: path.resolve(
                getAppDir(),
                'firmware/direct_test_mode_pca10040.hex'
            ),
            fwVersion: 'dtm-fw-1.0.0',
            fwIdAddress: 0x6000,
        },
        pca10056: {
            fw: path.resolve(
                getAppDir(),
                'firmware/direct_test_mode_pca10056.hex'
            ),
            fwVersion: 'dtm-fw-1.0.0',
            fwIdAddress: 0x6000,
        },
        pca10090: {
            fw: path.resolve(
                getAppDir(),
                'firmware/direct_test_mode_pca10056.hex'
            ),
            fwVersion: 'dtm-fw-1.0.0',
            fwIdAddress: 0x6000,
        },
    },
    allowCustomDevice: true,
};

const mapStateToProps = () => ({
    deviceListing,
    deviceSetup,
});

function mapDispatchToProps(dispatch: TDispatch) {
    return {
        onDeviceSelected: (device: Device) => {
            dispatch(clearAllWarnings());
            if (compatiblePCAs.includes(device.boardVersion ?? '')) {
                logger.info(
                    `Validating firmware for device with s/n ${device.serialNumber}`
                );
            } else {
                logger.info('No firmware defined for selected device');
                logger.info(
                    'Please make sure the device has been programmed with a supported firmware'
                );
            }
        },
        onDeviceDeselected: () => {
            dispatch(deselectDevice());
            dispatch(deviceDeselected());
            dispatch(clearAllWarnings());
        },
        onDeviceIsReady: (device: Device) => {
            logger.info('Device selected successfully');
            const selectedSerialport =
                device.serialPorts.length === 3
                    ? device.serialPorts[1].comName
                    : device.serialPorts[0].comName;

            dispatch(serialportSelected(selectedSerialport as string));
            dispatch(
                dtmBoardSelected({
                    board: device.boardVersion,
                    serialports: device.serialPorts.map(
                        port => port.comName ?? ''
                    ),
                })
            );
            dispatch(
                setupDtm(
                    selectedSerialport as string,
                    device.boardVersion as string
                )
            );
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceSelector);
