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

import React, { useState } from 'react';
import { ControlLabel, FormControl, FormGroup, Panel, MenuItem, DropdownButton } from 'react-bootstrap';
import Slider from 'react-rangeslider';
import { DTM, DTM_PKT_STRING } from 'nrf-dtm-js/src/DTM.js';
import PropTypes from 'prop-types';

import 'react-rangeslider/lib/index.css';
import { fromPCA } from '../utils/boards';

const packetTypeView = (bitpatternUpdated, pkgType) => {
    const items = Object.keys(DTM.DTM_PKT).map((keyname, idx) => (
        <MenuItem
            eventKey={idx}
            onSelect={evt => bitpatternUpdated(evt)}
        >
            {DTM_PKT_STRING[idx]}
        </MenuItem>
        ),
    );
    return (
        <div>
            <label htmlFor={'transmitPacketType'}>Transmit packet type</label>
            <br />
            <DropdownButton
                title={DTM_PKT_STRING[pkgType]}
                id={'dropdown-variants-packet-type'}
            >
                {items}
            </DropdownButton>
        </div>
    );
};

const packetLengthView = (currentLength, changedFunc, pkgType) => {
    const lengthChanged = evt => {
        const length = Math.min(255, Math.max(0, evt.target.value));
        changedFunc(length);
    };
    return (
        <div>
            <FormGroup controlId="formPacketLength">
                <ControlLabel>Packet length (bytes)</ControlLabel>
                <FormControl
                    onChange={lengthChanged}
                    disabled={pkgType === DTM.DTM_PKT.PAYLOAD_VENDOR}
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

const txPowerView = (boardType, txPowerIdx, txPowerUpdated) => {
    const compatibility = fromPCA(boardType);
    const maxDbmRangeValue = compatibility.txPower.length - 1;

    const label = {};
    label[0] = `${compatibility.txPower[0]} dBm`;
    label[maxDbmRangeValue] = `${compatibility.txPower[maxDbmRangeValue]} dBm`;
    return (
        <div>
            <label htmlFor="txPower">TX Power</label>
            <br />
            <Slider
                value={txPowerIdx}
                onChange={value => txPowerUpdated(value)}
                max={maxDbmRangeValue}
                min={0}
                labels={label}
                disabled={null}
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
}) => {
    const [open, setOpen] = useState(true);
    return (
        <div className="app-sidepanel-component-view">
            <Panel
                collapsible
                expanded={open}
                header="Transmitter settings"
                onSelect={() => setOpen(!open)}
            >
                {txPowerView(boardType, txPowerIdx, txPowerUpdated)}
                <br /><br />
                {packetTypeView(bitpatternUpdated, pkgType)}
                <br />
                {packetLengthView(packetLength, lengthUpdated, pkgType)}
            </Panel>
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
};

export default TransmitSetupView;
