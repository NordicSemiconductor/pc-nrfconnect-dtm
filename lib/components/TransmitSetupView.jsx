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

import React from 'react';
import { ControlLabel, FormControl, FormGroup, Panel, MenuItem, DropdownButton } from 'react-bootstrap';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import PropTypes from 'prop-types';
import { logger } from 'nrfconnect/core';
import * as SettingsActions from '../actions/settingsActions';
import { fromPCA } from '../utils/boards';
import { DTM, DTM_PKT_STRING } from 'nrf-dtm-js';

class TransmitSetupView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open:true,
        }
    }
    togglePanel() {
        this.setState((prevState, props) => {
            return {open: !prevState.open};
        });
    }
    packetTypeView() {
        let items = Object.keys(DTM.DTM_PKT).map((keyname, idx) => (
                <MenuItem
                eventKey={idx}
                onSelect={evt => this.props.bitpatternUpdated(evt)}>
                    {DTM_PKT_STRING[idx]}
                </MenuItem>
            )
        );
        return (
            <div>
                <label>Transmit packet type</label><br />
                <DropdownButton

                    title={DTM_PKT_STRING[this.props.pkgType]}
                    id={`dropdown-variants-packet-type`}
                    >
                    {items}
                </DropdownButton>
            </div>
        );
    }
    packetLengthView() {
        const lengthChanged = evt => {
            const length = Math.min(255, Math.max(0, evt.target.value));
            this.props.lengthUpdated(length);
        }
        return (
            <div>
                <FormGroup controlId="formPacketLength">
                  <ControlLabel>Packet length (bytes)</ControlLabel>
                  <FormControl
                    onChange={lengthChanged}
                    disabled={this.props.pkgType === DTM.DTM_PKT.PAYLOAD_VENDOR}
                    componentClass="input" value={this.props.packetLength}
                    min={1}
                    max={255}
                    step={1}
                    type="number"
                    bsSize="sm"
                  />
                </FormGroup>
            </div>
        );
    }

    txPowerView() {
        const compatibility = fromPCA(this.props.boardType);
        const maxDbmRangeValue = compatibility.txPower.length - 1;

        const label = {};
        label[0] = `${compatibility.txPower[0]} dBm`;
        label[maxDbmRangeValue] = `${compatibility.txPower[maxDbmRangeValue]} dBm`;
        return (
            <div>
            <label>TX Power</label><br />
            <Slider
                value={this.props.txPowerIdx}
                onChange={value => this.props.txPowerUpdated(value)}
                max={maxDbmRangeValue}
                min={0}
                labels={label}
                disabled={null}
                format={i => `${compatibility.txPower[i]} dBm`}
            />
            </div>
        );
    }

// tooltip=
    render() {
        return (
            <div className="app-transmit-setup-view">
            <Panel collapsible
            expanded={this.state.open}
            header='Transmitter settings'
            onSelect={() => this.togglePanel()}>
            {this.txPowerView()}
            <br /><br />
            {this.packetTypeView()}
            <br />
            {this.packetLengthView()}


            </Panel>
            </div>
        );
    }
};

TransmitSetupView.propTypes = {
};

export default TransmitSetupView;
