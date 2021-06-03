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

import React from 'react';
import FormLabel from 'react-bootstrap/FormLabel';
import { useDispatch, useSelector } from 'react-redux';
import { DTM, DTM_PKT_STRING } from 'nrf-dtm-js/src/DTM';
import { Group, NumberInlineInput, Slider } from 'pc-nrfconnect-shared';

import {
    bitpatternChanged,
    getBitpattern,
    getLength,
    lengthChanged,
} from '../reducers/settingsReducer';
import { getIsRunning } from '../reducers/testReducer';
import MyDropdownButton from './dropdown/Dropdown';
import DropdownItem from './dropdown/DropdownItem';

import 'react-rangeslider/lib/index.css';

const VENDOR_PAYLOAD_LENGTH = 1;

const packetTypeView = (
    bitpatternUpdated,
    lengthUpdated,
    pkgType,
    isRunning,
    isVendorPayload
) => {
    const items = Object.keys(DTM.DTM_PKT)
        .filter(key => key !== 'DEFAULT')
        .map((key, packageType) => (
            <DropdownItem
                key={key}
                title={DTM_PKT_STRING[packageType]}
                onSelect={() => {
                    bitpatternUpdated(packageType);
                    if (isVendorPayload(packageType)) {
                        lengthUpdated(VENDOR_PAYLOAD_LENGTH);
                    }
                }}
            />
        ));

    return (
        <>
            <FormLabel>Packet type</FormLabel>
            <MyDropdownButton
                title={DTM_PKT_STRING[pkgType]}
                items={[items]}
                disabled={isRunning}
            />
        </>
    );
};

const packetLengthView = (currentLength, changedFunc, isRunning) => {
    const range = { min: 1, max: 255 };
    return (
        <>
            <FormLabel htmlFor="packet-length-slider">
                Packet length
                <NumberInlineInput
                    value={currentLength}
                    range={range}
                    onChange={value =>
                        changedFunc(isRunning ? currentLength : value)
                    }
                />{' '}
                Bytes
            </FormLabel>
            <Slider
                id="packet-length-slider"
                values={[currentLength]}
                onChange={[
                    value => changedFunc(isRunning ? currentLength : value),
                ]}
                range={range}
            />
        </>
    );
};

const PacketView = () => {
    const pkgType = useSelector(getBitpattern).toString();
    const packetLength = useSelector(getLength);
    const isRunning = useSelector(getIsRunning);

    const dispatch = useDispatch();

    const lengthChangedAction = value => dispatch(lengthChanged(value));
    const isVendorPayload = type =>
        DTM_PKT_STRING[type] === DTM_PKT_STRING[DTM.DTM_PKT.PAYLOAD_VENDOR];

    return (
        <>
            <div className="app-sidepanel-component-inputbox">
                {packetTypeView(
                    value => dispatch(bitpatternChanged(value)),
                    lengthChangedAction,
                    pkgType,
                    isRunning,
                    isVendorPayload
                )}
            </div>

            {!isVendorPayload(pkgType) && (
                <div className="app-sidepanel-component-inputbox">
                    {packetLengthView(
                        packetLength,
                        lengthChangedAction,
                        isRunning
                    )}
                </div>
            )}
        </>
    );
};

export default PacketView;
