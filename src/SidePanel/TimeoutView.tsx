/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NumberInput, Slider } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { getTimeout, timeoutChanged } from '../reducers/settingsReducer';
import { getIsRunning } from '../reducers/testReducer';

const TimeoutSetupView = () => {
    const range = { min: 0, max: 20 };

    const timeout = useSelector(getTimeout);
    const isRunning = useSelector(getIsRunning);

    const dispatch = useDispatch();

    const updateTimeout = (time: number) => dispatch(timeoutChanged(time));

    return (
        <div className="tw-flex tw-flex-col tw-gap-1">
            <div className="tw-flex tw-flex-row">
                {timeout === 0 ? (
                    <span>No timeout</span>
                ) : (
                    <NumberInput
                        label="Timeout after"
                        minWidth
                        value={timeout / 1000}
                        range={range}
                        onChange={val => updateTimeout(val)}
                        disabled={isRunning}
                        unit="s"
                    />
                )}
            </div>
            <Slider
                id="transit-channel-slider"
                values={[timeout / 1000]}
                onChange={[val => updateTimeout(val)]}
                range={range}
                disabled={isRunning}
            />
        </div>
    );
};

export default TimeoutSetupView;
