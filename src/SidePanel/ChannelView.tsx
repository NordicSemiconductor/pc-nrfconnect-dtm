/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
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
import ToggleChannelModeView from './ToggleChannelModeView';

interface DelaySliderProps {
    isRunning: boolean;
    currentValue: number;
    changedFunc: (value: number) => void;
}

const DelaySlider = ({
    isRunning,
    currentValue,
    changedFunc,
}: DelaySliderProps) => {
    const range = { min: 20, max: 20000, decimals: 0 };
    return (
        <div className="slider-container">
            <FormLabel htmlFor="sweep-delay-slider">
                Transmit delay
                <NumberInlineInput
                    value={currentValue}
                    range={range}
                    disabled={isRunning}
                    onChange={value =>
                        changedFunc(isRunning ? currentValue : value)
                    }
                />{' '}
                ms
            </FormLabel>
            <Slider
                id="sweep-delay-slider"
                values={[currentValue]}
                disabled={isRunning}
                onChange={[
                    value => changedFunc(isRunning ? currentValue : value),
                ]}
                range={range}
            />
        </div>
    );
};

DelaySlider.propTypes = {
    isRunning: PropTypes.bool.isRequired,
    currentValue: PropTypes.number.isRequired,
    changedFunc: PropTypes.func.isRequired,
};

interface Props {
    paneName: 'transmitter' | 'receiver';
}

const ChannelView: React.FC<Props> = ({ paneName }) => {
    const transmitOrReceiveLabel =
        paneName === 'transmitter' ? 'Transmit' : 'Receive';
    const channelMode = useSelector(getChannelMode);
    const channelSingle = useSelector(getSingleChannel);
    const channelRange = useSelector(getChannelRange);
    const sweepTime = useSelector(getSweepTime);
    const isRunning = useSelector(getIsRunning);

    const dispatch = useDispatch();

    const lowChannel = Math.min(...channelRange);
    const highChannel = Math.max(...channelRange);

    return (
        <>
            <ToggleChannelModeView isRunning={isRunning} />

            {channelMode === DTM_CHANNEL_MODE.single && (
                <div className="slider-container">
                    <FormLabel htmlFor="channel-slider">
                        {`${transmitOrReceiveLabel} on channel`}
                        <NumberInlineInput
                            value={bleChannels[channelSingle]}
                            range={{
                                min: lowChannel,
                                max: bleChannels.max,
                                decimals: 0,
                            }}
                            disabled={isRunning}
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
                        disabled={isRunning}
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
                            max: bleChannels.max,
                            decimals: 0,
                        }}
                    />
                </div>
            )}
            {channelMode === DTM_CHANNEL_MODE.sweep && (
                <>
                    <DelaySlider
                        isRunning={isRunning}
                        currentValue={sweepTime}
                        changedFunc={value => dispatch(sweepTimeChanged(value))}
                    />

                    <div className="slider-container">
                        <FormLabel htmlFor="channel-slider">
                            {`${transmitOrReceiveLabel} on channel`}
                            <NumberInlineInput
                                value={bleChannels[lowChannel]}
                                range={{
                                    min: bleChannels.min,
                                    max: bleChannels.max,
                                    decimals: 0,
                                }}
                                disabled={isRunning}
                                onChange={newMinValue =>
                                    dispatch(
                                        channelRangeChanged([
                                            isRunning
                                                ? lowChannel
                                                : newMinValue,
                                            channelRange[1],
                                        ])
                                    )
                                }
                            />
                            {' to '}
                            <NumberInlineInput
                                value={bleChannels[highChannel]}
                                range={{
                                    min: bleChannels.min,
                                    max: bleChannels.max,
                                    decimals: 0,
                                }}
                                disabled={isRunning}
                                onChange={newMaxValue =>
                                    dispatch(
                                        channelRangeChanged([
                                            channelRange[0],
                                            isRunning
                                                ? highChannel
                                                : newMaxValue,
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
                                decimals: 0,
                            }}
                            disabled={isRunning}
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
                    </div>
                </>
            )}
        </>
    );
};

export default ChannelView;
