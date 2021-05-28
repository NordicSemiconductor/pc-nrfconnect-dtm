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

import React from 'react';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { NumberInlineInput, Slider } from 'pc-nrfconnect-shared';

import {
    DTM_CHANNEL_MODE,
    dtmHighChannelChanged,
    dtmLowChannelChanged,
    dtmSingleChannelChanged,
    getChannelMode,
    getHighChannel,
    getLowChannel,
    getSingleChannel,
    getSweepTime,
    sweepTimeChanged,
} from '../reducers/settingsReducer';
import { getIsRunning } from '../reducers/testReducer';
import ToggleChannelModeView from './ToggleChannelModeView';

import 'react-rangeslider/lib/index.css';

const ChannelView = () => {
    const channelMode = useSelector(getChannelMode);
    const channelSingle = useSelector(getSingleChannel);
    const channelLow = useSelector(getLowChannel);
    const channelHigh = useSelector(getHighChannel);
    const sweepTime = useSelector(getSweepTime);
    const isRunning = useSelector(getIsRunning);

    const dispatch = useDispatch();

    const range = { min: 0, max: 39 };

    const ChannelSlider = (currentValue, changedFunc) => (
        <div>
            <Form.Label htmlFor="transit-channel-slider">
                <span className="flex-fill">Transit on channel</span>
                <NumberInlineInput
                    value={currentValue}
                    range={{ ...range }}
                    onChange={value =>
                        changedFunc(isRunning ? currentValue : value)
                    }
                />
            </Form.Label>
            <Slider
                id="transit-channel-slider"
                values={[currentValue]}
                onChange={[
                    value => changedFunc(isRunning ? currentValue : value),
                ]}
                range={{ ...range }}
            />
        </div>
    );

    const delayLabel =
        channelMode === DTM_CHANNEL_MODE.sweep
            ? 'Sweep delay'
            : 'Update period';

    const isSweepTimeDisabled =
        channelMode !== DTM_CHANNEL_MODE.sweep ? true : isRunning;

    return (
        <div className="app-sidepanel-panel">
            <div className="app-sidepanel-component-inputbox">
                <ToggleChannelModeView isRunning={isRunning} />
            </div>

            {channelMode === DTM_CHANNEL_MODE.single && (
                <div className="app-sidepanel-component-slider">
                    {ChannelSlider('Channel', channelSingle, channel =>
                        dispatch(dtmSingleChannelChanged(channel))
                    )}
                </div>
            )}
            {channelMode === DTM_CHANNEL_MODE.sweep && (
                <div className="app-sidepanel-component-slider">
                    {ChannelSlider('Channel Low', channelLow, channel =>
                        dispatch(dtmLowChannelChanged(channel))
                    )}
                </div>
            )}
            {channelMode === DTM_CHANNEL_MODE.sweep && (
                <div className="app-sidepanel-component-slider">
                    {ChannelSlider('Channel High', channelHigh, channel =>
                        dispatch(dtmHighChannelChanged(channel))
                    )}
                </div>
            )}

            <div className="app-sidepanel-component-inputbox">
                <Form>
                    <Form.Group controlId="formSweepTimeSelect">
                        <Form.Label>{delayLabel} (ms)</Form.Label>
                        <Form.Control
                            onChange={evt =>
                                dispatch(
                                    sweepTimeChanged(Number(evt.target.value))
                                )
                            }
                            as="input"
                            value={sweepTime}
                            min={20}
                            step={10}
                            type="number"
                            size="sm"
                            disabled={isSweepTimeDisabled}
                        />
                    </Form.Group>
                </Form>
            </div>
        </div>
    );
};

export default ChannelView;
