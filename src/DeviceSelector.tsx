/*
 * Copyright (c) 2021 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import {
    type AppThunk,
    type Device,
    DeviceSelector,
    logger,
} from '@nordicsemiconductor/pc-nrfconnect-shared';
import { type DeviceTraits } from '@nordicsemiconductor/pc-nrfconnect-shared/nrfutil/device';

import { disposeDTM } from './actions/dtm';
import {
    baudRateSelected,
    deviceDeselected as deviceDeselectedReducer,
    dtmBoardSelected,
    serialportSelected,
    setDeviceReady,
} from './reducers/deviceReducer';
import { type RootState } from './reducers/types';
import { clearAllWarnings } from './reducers/warningReducer';

const deviceListing: DeviceTraits = {
    serialPorts: true,
    jlink: true,
};

export default () => {
    const dispatch = useDispatch();
    return (
        <DeviceSelector
            deviceListing={deviceListing}
            onDeviceDeselected={() => {
                dispatch(deviceDeselected());
                dispatch(clearAllWarnings());
            }}
            onDeviceSelected={(device: Device) => {
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
            }),
        );

        if (device.persistedSerialPortOptions) {
            dispatch(
                serialportSelected(device.persistedSerialPortOptions.path),
            );
            dispatch(
                baudRateSelected(device.persistedSerialPortOptions.baudRate),
            );
        }

        dispatch(setDeviceReady(true));
    };
