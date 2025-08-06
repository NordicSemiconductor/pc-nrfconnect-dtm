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
    const txPower = useSelector(getTxPower);
    const boardType = useSelector(getBoard);
    const isRunning = useSelector(getIsRunning);
    const dispatch = useDispatch();

    const dBmValues = fromPCA(boardType).txPower;

    useEffect(() => {
        if (!dBmValues.includes(txPower)) {
            // Currently the dBmValues will always contain a 0
            dispatch(
                txPowerChanged(
                    dBmValues.includes(0) ? 0 : dBmValues[dBmValues.length / 2]
                )
            );
        }
    }, [dispatch, dBmValues, txPower]);

    return (
        <NumberInput
            showSlider
            minWidth
            unit="dBm"
            label="Transmit power"
            value={txPower}
            range={dBmValues}
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
