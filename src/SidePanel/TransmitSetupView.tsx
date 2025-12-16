/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    NumberInput,
    Overlay,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { getTxPower, txPowerChanged } from '../reducers/settingsReducer';
import { getIsRunning } from '../reducers/testReducer';
import dbmValues from '../utils/dbmValues';

const TxPowerView = () => {
    const txPower = useSelector(getTxPower);
    const isRunning = useSelector(getIsRunning);
    const dispatch = useDispatch();

    return (
        <NumberInput
            showSlider
            minWidth
            unit="dBm"
            label={
                <Overlay
                    tooltipId="tx-power-tooltip"
                    tooltipChildren={
                        <>
                            The official 0x09 DTM command sets the SoC TX output
                            power closest to the requested one when the exact
                            power level is not supported.
                        </>
                    }
                >
                    Transmit power
                </Overlay>
            }
            value={txPower}
            range={{
                min: Math.min(...dbmValues),
                max: Math.max(...dbmValues),
                step: 1,
            }}
            disabled={isRunning}
            onChange={value => {
                dispatch(txPowerChanged(value));
            }}
            onChangeComplete={value => {
                dispatch(txPowerChanged(value));
            }}
        />
    );
};

export default TxPowerView;
