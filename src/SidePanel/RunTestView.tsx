/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';

import playSvg from '../../resources/play-circle.svg';
import stopSvg from '../../resources/stop-circle.svg';
import { endTests, startTests } from '../actions/testActions';
import { getIsReady } from '../reducers/deviceReducer';
import { getIsRunning } from '../reducers/testReducer';

const RunTestView = () => {
    const dispatch = useDispatch();

    const isRunning = useSelector(getIsRunning);
    const label = isRunning ? 'Stop test' : 'Start test';
    const src = isRunning ? stopSvg : playSvg;

    const disabled = !useSelector(getIsReady);

    const onClick = () => {
        dispatch(isRunning ? endTests() : startTests());
    };

    return (
        <Button
            className={`w-100 secondary-btn start-stop  ${
                isRunning ? 'active-animation' : ''
            }`}
            variant="secondary"
            disabled={disabled}
            onClick={onClick}
        >
            <img alt="" src={src} />
            {label}
        </Button>
    );
};

export default RunTestView;
