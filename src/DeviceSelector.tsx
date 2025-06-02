/*
 * Copyright (c) 2021 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import {
    AppThunk,
    Device,
    DeviceSelector,
    DeviceSetupConfig,
    getAppDir,
    jprogDeviceSetup,
    logger,
} from '@nordicsemiconductor/pc-nrfconnect-shared';
import { DeviceTraits } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil/device';
import path from 'path';

import { disposeDTM } from './actions/dtm';
import {
    deviceDeselected as deviceDeselectedReducer,
    dtmBoardSelected,
    serialportSelected,
    setDeviceReady,
} from './reducers/deviceReducer';
import { RootState } from './reducers/types';
import { clearAllWarnings } from './reducers/warningReducer';

const deviceListing: DeviceTraits = {
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
            false,
            true
        ),
    ],
    allowCustomDevice: true,
};

export default () => {
    const dispatch = useDispatch();
    return (
        <DeviceSelector
            deviceListing={deviceListing}
            deviceSetupConfig={deviceSetupConfig}
            onDeviceDeselected={() => {
                dispatch(deviceDeselected());
                dispatch(clearAllWarnings());
            }}
            onDeviceIsReady={(device: Device) => {
                dispatch(onDeviceIsReady(device));
            }}
        />
    );
};

export const deviceDeselected =
    (): AppThunk<RootState, Promise<void>> => async dispatch => {
        dispatch(deviceDeselectedReducer());
        await disposeDTM().catch(() => {});
    };

export const onDeviceIsReady =
    (device: Device): AppThunk<RootState> =>
    dispatch => {
        if (!device.serialPorts || device.serialPorts.length === 0) {
            logger.error(`Missing serial port information`);
            return;
        }

        dispatch(
            dtmBoardSelected({
                board: device.devkit?.boardVersion,
                serialports: device.serialPorts.map(port => port.comName ?? ''),
            })
        );

        if (device.persistedSerialPortOptions) {
            dispatch(
                serialportSelected(device.persistedSerialPortOptions.path)
            );
        }

        dispatch(setDeviceReady(true));
    };
