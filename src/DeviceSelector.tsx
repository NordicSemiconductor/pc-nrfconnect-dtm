/*
 * Copyright (c) 2021 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import path from 'path';
import {
    AppThunk,
    Device,
    DeviceSelector,
    DeviceSetupConfig,
    getAppDir,
    jprogDeviceSetup,
    logger,
    prepareDevice,
} from 'pc-nrfconnect-shared';

import { deselectDevice, selectDevice } from './actions/testActions';
import {
    deviceDeselected,
    dtmBoardSelected,
    serialportSelected,
    setDeviceReady,
} from './reducers/deviceReducer';
import { clearAllWarnings } from './reducers/warningReducer';
import { compatiblePCAs } from './utils/constants';

const deviceListing = {
    serialPorts: true,
    jlink: true,
};

export const deviceSetupConfig: DeviceSetupConfig = {
    deviceSetups: [
        jprogDeviceSetup(
            [
                {
                    key: 'pca10040',
                    fw: path.resolve(
                        getAppDir(),
                        'firmware/direct_test_mode_pca10040.hex'
                    ),
                    fwVersion: 'dtm-fw-1.0.0',
                    fwIdAddress: 0x6000,
                },
                {
                    key: 'pca10056',
                    fw: path.resolve(
                        getAppDir(),
                        'firmware/direct_test_mode_pca10056.hex'
                    ),
                    fwVersion: 'dtm-fw-1.0.0',
                    fwIdAddress: 0x6000,
                },
            ],
            true
        ),
    ],
    allowCustomDevice: true,
};

export const recoverHex =
    (device: Device): AppThunk =>
    async dispatch => {
        await dispatch(deselectDevice());
        dispatch(setDeviceReady(true));
        logger.info('Recovering device');

        dispatch(
            prepareDevice(
                device,
                deviceSetupConfig,
                programmedDevice => {
                    dispatch(openDevice(programmedDevice));
                },
                () => {},
                false,
                false
            )
        );
    };

export const openDevice =
    (device: Device): AppThunk =>
    dispatch => {
        logger.info('Device selected successfully');

        if (
            !device.serialport ||
            !device.serialPorts ||
            device.serialPorts.length === 0
        ) {
            logger.error(`Missing serial port information`);
            return;
        }

        dispatch(
            dtmBoardSelected({
                board: device.boardVersion,
                serialports: device.serialPorts.map(port => port.comName ?? ''),
            })
        );

        if (device.persistedSerialPortOptions) {
            dispatch(
                serialportSelected(device.persistedSerialPortOptions.path)
            );
        }

        dispatch(selectDevice());
    };

export default () => {
    const dispatch = useDispatch();

    return (
        <DeviceSelector
            deviceSetupConfig={deviceSetupConfig}
            deviceListing={deviceListing}
            onDeviceConnected={device =>
                logger.info(`Device Connected SN:${device.serialNumber}`)
            }
            onDeviceDisconnected={device =>
                logger.info(`Device Disconnected SN:${device.serialNumber}`)
            }
            onDeviceSelected={device => {
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
            }}
            onDeviceIsReady={device => {
                dispatch(openDevice(device));
            }}
            onDeviceDeselected={() => {
                dispatch(deselectDevice());
                dispatch(deviceDeselected());
                dispatch(clearAllWarnings());
            }}
        />
    );
};
