/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StartStopButton } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { endTests, startTests } from '../actions/testActions';
import { getIsReady } from '../reducers/deviceReducer';
import { getIsRunning } from '../reducers/testReducer';

const RunTestView = () => {
    const dispatch = useDispatch();

    const isRunning = useSelector(getIsRunning);

    const disabled = !useSelector(getIsReady);

    const onClick = () => {
        dispatch(isRunning ? endTests() : startTests());
    };

    return (
        <div>
            <StartStopButton
                startText="Start test"
                stopText="Stop test"
                onClick={onClick}
                disabled={disabled}
                started={isRunning}
            />
        </div>
    );
};

export default RunTestView;
