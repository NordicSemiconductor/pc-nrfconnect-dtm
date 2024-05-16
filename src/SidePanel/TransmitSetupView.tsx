/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NumberInput } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { getBoard } from '../reducers/deviceReducer';
import { getTxPower, txPowerChanged } from '../reducers/settingsReducer';
import { getIsRunning } from '../reducers/testReducer';
import { fromPCA } from '../utils/boards';

const TxPowerView = () => {
    const txPowerIdx = useSelector(getTxPower);
    const boardType = useSelector(getBoard);
    const isRunning = useSelector(getIsRunning);
    const dispatch = useDispatch();

    const dBmValues = fromPCA(boardType).txPower;

    useEffect(() => {
        if (dBmValues.indexOf(txPowerIdx) === -1) {
            dispatch(txPowerChanged(dBmValues.length - 1));
        }
    }, [dispatch, dBmValues, txPowerIdx]);

    return (
        <NumberInput
            showSlider
            minWidth
            unit="dBm"
            label="Transmit power"
            value={dBmValues[txPowerIdx]}
            range={dBmValues}
            disabled={isRunning}
            onChange={value => {
                dispatch(txPowerChanged(dBmValues.indexOf(value)));
            }}
            onChangeComplete={value => {
                dispatch(txPowerChanged(dBmValues.indexOf(value)));
            }}
        />
    );
};

export default TxPowerView;
