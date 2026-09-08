/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { enterBootloader } from '../actions/testActions';
import { getIsReady } from '../reducers/deviceReducer';
import { getIsRunning } from '../reducers/testReducer';

const BootloaderView = () => {
    const dispatch = useDispatch();
    const isRunning = useSelector(getIsRunning);
    const isReady = useSelector(getIsReady);

    return (
        <Button
            variant="secondary"
            className="tw-w-full"
            disabled={!isReady || isRunning}
            title="Reboot the device into MCUboot serial recovery for a firmware update over USB"
            onClick={() => dispatch(enterBootloader())}
        >
            Enter bootloader
        </Button>
    );
};

export default BootloaderView;
