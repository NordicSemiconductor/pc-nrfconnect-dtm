/* Copyright (c) 2015 - 2021, Nordic Semiconductor ASA
 *
 * All rights reserved.
 *
 * Use in source and binary forms, redistribution in binary form only, with
 * or without modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions in binary form, except as embedded into a Nordic
 *    Semiconductor ASA integrated circuit in a product or a software update for
 *    such product, must reproduce the above copyright notice, this list of
 *    conditions and the following disclaimer in the documentation and/or other
 *    materials provided with the distribution.
 *
 * 2. Neither the name of Nordic Semiconductor ASA nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * 3. This software, with or without modification, must only be used with a Nordic
 *    Semiconductor ASA integrated circuit.
 *
 * 4. Any software provided in binary form under this license must not be reverse
 *    engineered, decompiled, modified and/or disassembled.
 *
 * THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
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
