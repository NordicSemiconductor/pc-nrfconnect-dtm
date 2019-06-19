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

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import 'react-rangeslider/lib/index.css';

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import Slider from 'react-rangeslider';

import * as SettingsActions from '../actions/settingsActions';
import { TEST_STATES } from '../actions/testActions';
import ToggleChannelModeView from '../containers/toggleChannelModeView';

const { idle } = TEST_STATES;

const ChannelView = ({
    channel,
    channelMode,
    channelLow,
    channelHigh,
    sweepTime,
    onChannelChanged,
    onChannelLowChanged,
    onChannelHighChanged,
    onSweepTimeChanged,
    testingState,
}) => {
    const [open, setOpen] = useState(true);

    const ChannelSlider = (label, currentValue, changedFunc) => (
        <div>
            <label htmlFor={`ChannelSlider-${label}-label`}>
                {`${label} [${currentValue}]`}
            </label>
            <Slider
                value={currentValue}
                onChange={value => {
                    if (testingState === idle) {
                        changedFunc(value);
                    } else {
                        changedFunc(currentValue);
                    }
                }}
                max={39}
                min={0}
                labels={{ 0: '0', 39: '39' }}
            />
        </div>
    );

    const SweepTime = (value, changedFunc) => (
        <form>
            <FormGroup
                controlId="formSweepTimeSelect"
            >
                <FormLabel>Sweep delay (ms)</FormLabel>
                <FormControl
                    onChange={evt => changedFunc(evt.target.value)}
                    componentClass="input"
                    value={value}
                    min={20}
                    step={10}
                    type="number"
                    bsSize="sm"
                    disabled={testingState !== idle}
                />
            </FormGroup>
        </form>
    );

    return (
        <div
            className="app-sidepanel-panel"
        >
            <Card
                collapsible
                expanded={open}
                header="Channel settings"
                onSelect={() => setOpen(!open)}
            >
                <div className="app-sidepanel-component-inputbox">
                    <ToggleChannelModeView testingState={testingState} />
                </div>

                {channelMode === SettingsActions.DTM_CHANNEL_MODE.single
                    && <div className="app-sidepanel-component-slider">{ChannelSlider('Channel', channel, onChannelChanged)}</div>
                }
                {channelMode === SettingsActions.DTM_CHANNEL_MODE.sweep
                    && <div className="app-sidepanel-component-slider">{ChannelSlider('Channel Low', channelLow, onChannelLowChanged)}</div>
                }
                {channelMode === SettingsActions.DTM_CHANNEL_MODE.sweep
                    && <div className="app-sidepanel-component-slider">{ChannelSlider('Channel High', channelHigh, onChannelHighChanged)}</div>
                }

                <div className="app-sidepanel-component-inputbox">
                    {channelMode === SettingsActions.DTM_CHANNEL_MODE.sweep
                && SweepTime(sweepTime, onSweepTimeChanged)
                    }
                </div>
            </Card>
        </div>
    );
};

ChannelView.propTypes = {
    channelMode: PropTypes.number.isRequired,
    channel: PropTypes.number.isRequired,
    channelLow: PropTypes.number.isRequired,
    channelHigh: PropTypes.number.isRequired,
    sweepTime: PropTypes.number.isRequired,
    onChannelChanged: PropTypes.func.isRequired,
    onChannelLowChanged: PropTypes.func.isRequired,
    onChannelHighChanged: PropTypes.func.isRequired,
    onSweepTimeChanged: PropTypes.func.isRequired,
    testingState: PropTypes.number.isRequired,
};

export default ChannelView;
