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

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';

import { TEST_STATES } from '../actions/testActions';

const { idle } = TEST_STATES;


const TimeoutSetupView = ({
    timeout,
    onTimeoutChanged,
    testingState,
}) => {
    const [enableTimeout, setEnableTimeout] = useState(timeout !== 0);
    const [timeoutValue, setTimeoutValue] = useState(timeout === 0 ? 1000 : timeout);
    const [open, setOpen] = useState(true);

    const toggleTimeout = () => {
        if (enableTimeout) {
            onTimeoutChanged(0);
        } else {
            onTimeoutChanged(timeoutValue);
        }
        setEnableTimeout(!enableTimeout);
    };

    const updateTimeout = time => {
        onTimeoutChanged(time);
        setTimeoutValue(time);
    };

    return (
        <div className="app-sidepanel-panel">
            <Card
                collapsible
                expanded={open}
                header="Timeout settings"
                onSelect={() => setOpen(!open)}
            >
                <FormCheck
                    checked={enableTimeout}
                    onClick={() => toggleTimeout()}
                    disabled={testingState !== idle}
                    label="Enable"
                />

                <FormGroup
                    controlId="formTimeoutSelect"
                >
                    <FormLabel>
                        Timeout (ms)
                    </FormLabel>
                    <FormControl
                        onChange={evt => updateTimeout(evt.target.value)}
                        componentClass="input"
                        value={timeoutValue}
                        min={20}
                        step={10}
                        type="number"
                        bsSize="sm"
                        disabled={!enableTimeout || testingState !== idle}
                    />
                </FormGroup>
            </Card>
        </div>
    );
};

TimeoutSetupView.propTypes = {
    timeout: PropTypes.number.isRequired,
    onTimeoutChanged: PropTypes.func.isRequired,
    testingState: PropTypes.number.isRequired,

};
export default TimeoutSetupView;
