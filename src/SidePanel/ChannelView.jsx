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
import PropTypes from 'prop-types';

import {
    channelRangeChanged,
    DTM_CHANNEL_MODE,
    dtmSingleChannelChanged,
    getChannelMode,
    getChannelRange,
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

DelaySlider.propTypes = {
    isRunning: PropTypes.bool.isRequired,
    currentValue: PropTypes.number.isRequired,
    changedFunc: PropTypes.func.isRequired,
};

const ChannelView = () => {
    const isTransmitterPane = useSelector(isRealTimePane);
    const channelMode = useSelector(getChannelMode);
    const channelSingle = useSelector(getSingleChannel);
    const channelRange = useSelector(getChannelRange);
    const sweepTime = useSelector(getSweepTime);
    const isRunning = useSelector(getIsRunning);

    const dispatch = useDispatch();

    const transmitOrReceiveLabel = isTransmitterPane ? 'Transmit' : 'Receive';

    const lowChannel = Math.min(...channelRange);
    const highChannel = Math.max(...channelRange);

    return (
        <>
            <ToggleChannelModeView isRunning={isRunning} />

            {channelMode === DTM_CHANNEL_MODE.single && (
                <>
                    <FormLabel htmlFor="channel-slider">
                        {`${transmitOrReceiveLabel} on channel`}
                        <NumberInlineInput
                            value={channelSingle}
                            range={{
                                min: lowChannel,
                                max: bleChannels.max,
                            }}
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
                        range={{
                            min: bleChannels.min,
                            max: highChannel,
                        }}
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
                        {`${transmitOrReceiveLabel} on channel`}
                        <NumberInlineInput
                            value={bleChannels[lowChannel]}
                            range={{
                                min: bleChannels.min,
                                max: bleChannels.max,
                            }}
                            onChange={newMinValue =>
                                dispatch(
                                    channelRangeChanged([
                                        isRunning ? lowChannel : newMinValue,
                                        channelRange[1],
                                    ])
                                )
                            }
                        />
                        {' to '}
                        <NumberInlineInput
                            value={highChannel}
                            range={{
                                min: bleChannels.min,
                                max: bleChannels.max,
                            }}
                            onChange={newMaxValue =>
                                dispatch(
                                    channelRangeChanged([
                                        channelRange[0],
                                        isRunning ? highChannel : newMaxValue,
                                    ])
                                )
                            }
                        />
                    </FormLabel>
                    <Slider
                        id="channel-slider"
                        values={channelRange}
                        range={{
                            min: bleChannels.min,
                            max: bleChannels.max,
                        }}
                        onChange={[
                            newValue =>
                                dispatch(
                                    channelRangeChanged([
                                        isRunning ? lowChannel : newValue,
                                        channelRange[1],
                                    ])
                                ),
                            newValue =>
                                dispatch(
                                    channelRangeChanged([
                                        channelRange[0],
                                        isRunning ? highChannel : newValue,
                                    ])
                                ),
                        ]}
                    />
                </>
            )}
        </>
    );
};

export default ChannelView;
