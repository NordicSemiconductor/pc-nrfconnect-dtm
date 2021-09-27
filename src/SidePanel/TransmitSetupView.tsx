/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState } from 'react';
import FormLabel from 'react-bootstrap/FormLabel';
import { useDispatch, useSelector } from 'react-redux';
import { NumberInlineInput, Slider } from 'pc-nrfconnect-shared';

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
    const maxDbmRange = dBmValues.length - 1;

    const [txPower, setTxPower] = useState(dBmValues[txPowerIdx]);

    return (
        <div className="slider-container">
            <FormLabel htmlFor="transmit-power-slider">
                Transmit power
                <NumberInlineInput
                    value={txPower}
                    range={{ min: dBmValues[0], max: dBmValues[maxDbmRange] }}
                    disabled={isRunning}
                    onChange={value => {
                        const index = dBmValues.findIndex(e => e === value);
                        if (index >= 0) dispatch(txPowerChanged(index));
                        setTxPower(value);
                    }}
                    onChangeComplete={value => {
                        const index = dBmValues.findIndex(e => e === value);
                        if (index < 0) setTxPower(dBmValues[txPowerIdx]);
                        else dispatch(txPowerChanged(index));
                    }}
                />{' '}
                dBm
            </FormLabel>
            <Slider
                id="transmit-power-slider"
                values={[txPowerIdx]}
                onChange={[
                    value => {
                        dispatch(txPowerChanged(value));
                        setTxPower(dBmValues[value]);
                    },
                ]}
                range={{ min: 0, max: maxDbmRange }}
                disabled={isRunning}
            />
        </div>
    );
};

export default TxPowerView;
