/* Copyright (c) 2015 - 2018, Nordic Semiconductor ASA
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

import 'react-rangeslider/lib/index.css';

import { DTM, DTM_PKT_STRING } from 'nrf-dtm-js/src/DTM.js';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import Slider from 'react-rangeslider';

import { TEST_STATES } from '../actions/testActions';
import { fromPCA } from '../utils/boards';

const { idle } = TEST_STATES;

const packetTypeView = (bitpatternUpdated, pkgType, testingState) => {
    const items = Object.keys(DTM.DTM_PKT).map((keyname, idx) => (
        <Dropdown.Item
            eventKey={idx}
            onSelect={evt => bitpatternUpdated(evt)}
        >
            {DTM_PKT_STRING[idx]}
        </Dropdown.Item>
    ));
    return (
        <div>
            <label htmlFor="transmitPacketType">Transmit packet type</label>
            <br />
            <Dropdown.Toggle
                title={DTM_PKT_STRING[pkgType]}
                id="dropdown-variants-packet-type"
                disabled={testingState !== idle}
            >
                {items}
            </Dropdown.Toggle>
        </div>
    );
};

const packetLengthView = (currentLength, changedFunc, pkgType, testingState) => {
    const lengthChanged = evt => {
        const length = Math.min(255, Math.max(0, evt.target.value));
        changedFunc(length);
    };
    return (
        <div>
            <FormGroup controlId="formPacketLength">
                <FormLabel>Packet length (bytes)</FormLabel>
                <FormControl
                    onChange={lengthChanged}
                    disabled={pkgType === DTM.DTM_PKT.PAYLOAD_VENDOR || testingState !== idle}
                    componentClass="input"
                    value={currentLength}
                    min={1}
                    max={255}
                    step={1}
                    type="number"
                    bsSize="sm"
                />
            </FormGroup>
        </div>
    );
};

const txPowerView = (boardType, txPowerIdx, txPowerUpdated, testingState) => {
    const compatibility = fromPCA(boardType);
    const maxDbmRangeValue = compatibility.txPower.length - 1;

    const label = {};
    label[0] = `${compatibility.txPower[0]}`;
    label[maxDbmRangeValue] = `${compatibility.txPower[maxDbmRangeValue]}`;
    return (
        <div className="app-sidepanel-component-slider">
            <label htmlFor="txPower">{`TX Power [${compatibility.txPower[txPowerIdx]} dBm]`}</label>
            <Slider
                value={txPowerIdx}
                onChange={value => {
                    if (testingState === idle) {
                        return txPowerUpdated(value);
                    }
                    return txPowerUpdated(txPowerIdx);
                }
                }
                max={maxDbmRangeValue}
                min={0}
                labels={label}
                disabled={testingState !== idle}
                format={i => `${compatibility.txPower[i]} dBm`}
            />
        </div>
    );
};

const TransmitSetupView = ({
    packetLength,
    lengthUpdated,
    pkgType,
    bitpatternUpdated,
    txPowerUpdated,
    txPowerIdx,
    boardType,
    testingState,
}) => {
    const [open, setOpen] = useState(true);
    return (
        <div className="app-sidepanel-panel">
            <Card
                collapsible
                expanded={open}
                header="Transmitter settings"
                onSelect={() => setOpen(!open)}
            >
                {txPowerView(boardType, txPowerIdx, txPowerUpdated, testingState)}
                <div className="app-sidepanel-component-inputbox">
                    {packetTypeView(bitpatternUpdated, pkgType, testingState)}
                </div>
                <div className="app-sidepanel-component-inputbox">
                    {packetLengthView(packetLength, lengthUpdated, pkgType, testingState)}
                </div>
            </Card>
        </div>
    );
};

TransmitSetupView.propTypes = {
    packetLength: PropTypes.number.isRequired,
    lengthUpdated: PropTypes.func.isRequired,
    pkgType: PropTypes.number.isRequired,
    bitpatternUpdated: PropTypes.func.isRequired,
    txPowerUpdated: PropTypes.func.isRequired,
    txPowerIdx: PropTypes.number.isRequired,
    boardType: PropTypes.number.isRequired,
    testingState: PropTypes.number.isRequired,
};

export default TransmitSetupView;
