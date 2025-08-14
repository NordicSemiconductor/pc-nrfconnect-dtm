/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NumberInput } from '@nordicsemiconductor/pc-nrfconnect-shared';

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
            label="Transmit power"
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
