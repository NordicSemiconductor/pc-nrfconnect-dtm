/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    NumberInlineInput,
    NumberInput,
    Slider,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

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
import { isTransmitterPane as getIsTransmitterPane } from '../utils/panes';

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
    const isTransmitterPane = useSelector(getIsTransmitterPane);
    return (
        <NumberInput
            label={isTransmitterPane ? 'Transmit period' : 'Receive period'}
            showSlider
            minWidth
            range={range}
            value={currentValue}
            unit="ms"
            disabled={isRunning}
            onChange={value => changedFunc(isRunning ? currentValue : value)}
            title={`Each channel will ${
                isTransmitterPane ? 'transmit' : 'receive'
            } for ${currentValue}ms`}
        />
    );
};

interface Props {
    paneName: 'transmitter' | 'receiver';
}

const bleChannelsValues = [
    37, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 38, 11, 12, 13, 14, 15, 16, 17, 18,
    19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 39,
];

export default ({ paneName }: Props) => {
    const transmitOrReceiveLabel =
        paneName === 'transmitter' ? 'Transmit' : 'Receive';
    const channelMode = useSelector(getChannelMode);
    const channelSingle = useSelector(getSingleChannel);
    const channelRange = useSelector(getChannelRange);
    const sweepTime = useSelector(getSweepTime);
    const isRunning = useSelector(getIsRunning);

    const dispatch = useDispatch();

    const changeRangesIndexes = channelRange.map(v =>
        bleChannelsValues.indexOf(v)
    );
    const lowChannel = bleChannelsValues[Math.min(...changeRangesIndexes)];
    const highChannel = bleChannelsValues[Math.max(...changeRangesIndexes)];

    return (
        <>
            {channelMode === DTM_CHANNEL_MODE.single && (
                <NumberInput
                    showSlider
                    minWidth
                    label={`${transmitOrReceiveLabel} on channel`}
                    range={bleChannelsValues}
                    value={channelSingle}
                    disabled={isRunning}
                    onChange={value => dispatch(dtmSingleChannelChanged(value))}
                />
            )}
            {channelMode === DTM_CHANNEL_MODE.sweep && (
                <>
                    <DelaySlider
                        isRunning={isRunning}
                        currentValue={sweepTime}
                        changedFunc={value => dispatch(sweepTimeChanged(value))}
                    />

                    <div className="tw-flex tw-flex-col tw-gap-1">
                        <div className="tw-flex tw-flex-row">
                            {`${transmitOrReceiveLabel} on channel`}
                            <NumberInlineInput
                                value={lowChannel}
                                range={bleChannelsValues}
                                disabled={isRunning}
                                onChange={newMinValue => {
                                    if (newMinValue >= highChannel) return;
                                    dispatch(
                                        channelRangeChanged([
                                            newMinValue,
                                            channelRange[1],
                                        ])
                                    );
                                }}
                            />
                            {' to '}
                            <NumberInlineInput
                                value={highChannel}
                                range={bleChannelsValues}
                                disabled={isRunning}
                                onChange={newMaxValue => {
                                    if (newMaxValue <= lowChannel) return;
                                    dispatch(
                                        channelRangeChanged([
                                            channelRange[0],
                                            newMaxValue,
                                        ])
                                    );
                                }}
                            />
                        </div>
                        <Slider
                            values={channelRange}
                            range={bleChannelsValues}
                            disabled={isRunning}
                            onChange={[
                                newValue => {
                                    dispatch(
                                        channelRangeChanged([
                                            newValue,
                                            channelRange[1],
                                        ])
                                    );
                                },
                                newValue => {
                                    dispatch(
                                        channelRangeChanged([
                                            channelRange[0],
                                            newValue,
                                        ])
                                    );
                                },
                            ]}
                        />
                    </div>
                </>
            )}
        </>
    );
};
