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

import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import { useSelector } from 'react-redux';
import { DTM, DTM_PKT_STRING } from 'nrf-dtm-js/src/DTM.js';

import { bitpatternUpdated, lengthUpdated } from '../actions/settingsActions';
import { getBitpattern, getLength } from '../reducers/settingsReducer';
import { getIsRunning } from '../reducers/testReducer';

const VENDOR_PAYLOAD_LENGTH = 1;

const packetTypeView = (
    bitpatternUpdated,
    lengthUpdated,
    pkgType,
    isRunning
) => {
    const constantCarrierIdx = 3;
    const isVendorPayload = idx =>
        DTM_PKT_STRING[idx] === DTM_PKT_STRING[constantCarrierIdx];
    const items = Object.keys(DTM.DTM_PKT)
        .filter(keyname => keyname !== 'DEFAULT')
        .map((keyname, idx) => (
            <Dropdown.Item
                eventKey={idx}
                onSelect={evt => {
                    bitpatternUpdated(evt);
                    if (isVendorPayload(idx)) {
                        lengthUpdated(VENDOR_PAYLOAD_LENGTH);
                    }
                }}
                key={keyname}
            >
                {DTM_PKT_STRING[idx]}
            </Dropdown.Item>
        ));
    return (
        <div>
            <FormLabel>Packet type</FormLabel>
            <DropdownButton
                variant="light"
                title={DTM_PKT_STRING[pkgType]}
                id="dropdown-variants-packet-type"
                disabled={isRunning}
            >
                {items}
            </DropdownButton>
        </div>
    );
};

const packetLengthView = (currentLength, changedFunc, pkgType, isRunning) => {
    const isVendorPayload =
        parseInt(pkgType, 10) === DTM.DTM_PKT.PAYLOAD_VENDOR;
    const lengthChanged = evt => {
        const length = !isVendorPayload
            ? Math.min(255, Math.max(0, evt.target.value))
            : VENDOR_PAYLOAD_LENGTH;
        changedFunc(length);
    };
    return (
        <div>
            <FormGroup controlId="formPacketLength">
                <FormLabel>Packet length (bytes)</FormLabel>
                <FormControl
                    onChange={lengthChanged}
                    disabled={isVendorPayload || isRunning}
                    componentclass="input"
                    value={currentLength}
                    min={1}
                    max={255}
                    step={1}
                    type="number"
                    size="sm"
                />
            </FormGroup>
        </div>
    );
};

const PacketView = () => {
    const pkgType = useSelector(getBitpattern).toString();
    const packetLength = useSelector(getLength);
    const isRunning = useSelector(getIsRunning);

    return (
        <div className="app-sidepanel-panel">
            <div className="app-sidepanel-component-inputbox">
                {packetTypeView(
                    value => dispatch(bitpatternUpdated(value)),
                    value => dispatch(lengthUpdated(value)),
                    pkgType,
                    isRunning
                )}
            </div>
            <div className="app-sidepanel-component-inputbox">
                {packetLengthView(
                    packetLength,
                    lengthUpdated,
                    pkgType,
                    isRunning
                )}
            </div>
        </div>
    );
};

export default PacketView;
