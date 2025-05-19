/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import {
    AppThunk,
    Device,
    prepareDevice,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import {
    deviceDeselected,
    deviceSetupConfig,
    onDeviceIsReady,
} from '../DeviceSelector';
import { setDeviceReady } from '../reducers/deviceReducer';
import { RootState } from '../reducers/types';
import { clearAllWarnings } from '../reducers/warningReducer';

export const recoverHex =
    (device: Device): AppThunk<RootState> =>
    dispatch => {
        dispatch(deviceDeselected());
        dispatch(setDeviceReady(false));
        dispatch(
            prepareDevice(
                device,
                deviceSetupConfig,
                () => {
                    dispatch(clearAllWarnings());
                    dispatch(onDeviceIsReady(device));
                },
                () => {},
                undefined,
                false,
                false
            )
        );
    };
