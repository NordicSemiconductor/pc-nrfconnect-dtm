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

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import FormLabel from 'react-bootstrap/FormLabel';
import { useDispatch, useSelector } from 'react-redux';
import { bleChannels, NumberInlineInput, Slider } from 'pc-nrfconnect-shared';

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
import { isRealTimePane } from '../utils/panes';
import ToggleChannelModeView from './ToggleChannelModeView';

import 'react-rangeslider/lib/index.css';

const DelaySlider = ({ isRunning, currentValue, changedFunc }) => {
    const range = { min: 20, max: 20000 };
    return (
        <>
            <FormLabel htmlFor="sweep-delay-slider">
                Sweep delay
                <NumberInlineInput
                    value={currentValue}
                    range={range}
                    onChange={value =>
                        changedFunc(isRunning ? currentValue : value)
                    }
                />{' '}
                ms
            </FormLabel>
            <Slider
                id="sweep-delay-slider"
                values={[currentValue]}
                onChange={[
                    value => changedFunc(isRunning ? currentValue : value),
                ]}
                range={range}
            />
        </>
    );
};

const ChannelView = () => {
    const isTransmitterPane = useSelector(isRealTimePane);
    const channelMode = useSelector(getChannelMode);
    const channelSingle = useSelector(getSingleChannel);
    const channelLow = useSelector(getLowChannel);
    const channelHigh = useSelector(getHighChannel);
    const sweepTime = useSelector(getSweepTime);
    const isRunning = useSelector(getIsRunning);

    const dispatch = useDispatch();

    const channelRange = { min: bleChannels.min, max: bleChannels.max };

    const transmitOrReceiveLabel = isTransmitterPane ? 'Transmit' : 'Receive';

    return (
        <>
            <ToggleChannelModeView isRunning={isRunning} />

            {channelMode === DTM_CHANNEL_MODE.single && (
                <>
                    <FormLabel htmlFor="channel-slider">
                        {`${transmitOrReceiveLabel} on channel`}
                        <NumberInlineInput
                            value={channelSingle}
                            range={channelRange}
                            onChange={value =>
                                dispatch(
                                    dtmSingleChannelChanged(
                                        isRunning ? channelSingle : value
                                    )
                                )
                            }
                        />
                    </FormLabel>
                    <Slider
                        id="channel-slider"
                        values={[channelSingle]}
                        onChange={[
                            value =>
                                dispatch(
                                    dtmSingleChannelChanged(
                                        isRunning ? channelSingle : value
                                    )
                                ),
                        ]}
                        range={channelRange}
                    />
                </>
            )}
            {channelMode === DTM_CHANNEL_MODE.sweep && (
                <>
                    <DelaySlider
                        isRunning={isRunning}
                        currentValue={sweepTime}
                        changedFunc={value => dispatch(sweepTimeChanged(value))}
                    />

                    <FormLabel htmlFor="channel-slider">
                        {`${transmitOrReceiveLabel} on channels`}
                        <NumberInlineInput
                            value={channelLow}
                            range={channelRange}
                            onChange={newMinValue =>
                                dispatch(
                                    dtmLowChannelChanged(
                                        isRunning ? channelLow : newMinValue
                                    )
                                )
                            }
                        />
                        {' to '}
                        <NumberInlineInput
                            value={channelHigh}
                            range={channelRange}
                            onChange={newMaxValue =>
                                dispatch(
                                    dtmHighChannelChanged(
                                        isRunning ? channelHigh : newMaxValue
                                    )
                                )
                            }
                        />
                    </FormLabel>
                    <Slider
                        id="channel-slider"
                        values={[channelLow, channelHigh]}
                        onChange={[
                            newValue =>
                                dispatch(
                                    dtmLowChannelChanged(
                                        isRunning ? channelLow : newValue
                                    )
                                ),
                            newValue =>
                                dispatch(
                                    dtmHighChannelChanged(
                                        isRunning ? channelHigh : newValue
                                    )
                                ),
                        ]}
                        range={channelRange}
                    />
                </>
            )}
        </>
    );
};

export default ChannelView;
