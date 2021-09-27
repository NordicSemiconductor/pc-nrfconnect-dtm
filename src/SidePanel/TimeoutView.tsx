/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import FormLabel from 'react-bootstrap/FormLabel';
import { useDispatch, useSelector } from 'react-redux';
import { NumberInlineInput, Slider } from 'pc-nrfconnect-shared';

import { getTimeout, timeoutChanged } from '../reducers/settingsReducer';
import { getIsRunning } from '../reducers/testReducer';

const TimeoutSetupView = () => {
    const range = { min: 0, max: 20 };

    const timeout = useSelector(getTimeout);
    const isRunning = useSelector(getIsRunning);

    const dispatch = useDispatch();

    const updateTimeout = (time: number) => dispatch(timeoutChanged(time));

    return (
        <div className="slider-container">
            <FormLabel
                htmlFor="transit-channel-slider"
                className="timeout-label"
            >
                {timeout === 0 ? (
                    'No timeout'
                ) : (
                    <>
                        Timeout after
                        <NumberInlineInput
                            value={timeout / 1000}
                            range={range}
                            onChange={val => updateTimeout(val)}
                            disabled={isRunning}
                        />
                        s
                    </>
                )}
            </FormLabel>
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
