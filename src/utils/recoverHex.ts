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

import { deselectDevice } from '../actions/testActions';
import { deviceSetupConfig } from '../DeviceSelector';
import { setDeviceReady } from '../reducers/deviceReducer';
import { RootState } from '../reducers/types';
import { clearAllWarnings } from '../reducers/warningReducer';

export const recoverHex =
    (device: Device): AppThunk<RootState> =>
    async dispatch => {
        await dispatch(deselectDevice());
        dispatch(setDeviceReady(true));
        dispatch(
            prepareDevice(
                device,
                deviceSetupConfig,
                () => {
                    dispatch(clearAllWarnings());
                    dispatch(setDeviceReady(true));
                },
                () => {},
                undefined,
                false,
                false
            )
        );
    };
