/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StateSelector } from '@nordicsemiconductor/pc-nrfconnect-shared';

import channelModeChanged from '../actions/settingsActions';
import { DTM_CHANNEL_MODE, getChannelMode } from '../reducers/settingsReducer';

interface ToggleChannelModeViewProps {
    isRunning: boolean;
}

const ToggleChannelModeView = ({ isRunning }: ToggleChannelModeViewProps) => {
    const selected = useSelector(getChannelMode);

    const dispatch = useDispatch();

    const items = [
        { key: 'Single', value: DTM_CHANNEL_MODE.single },
        { key: 'Sweep', value: DTM_CHANNEL_MODE.sweep },
    ];

    return (
        <StateSelector
            items={items.map(e => e.key)}
            disabled={isRunning}
            onSelect={index => dispatch(channelModeChanged(items[index].value))}
            selectedItem={
                selected === DTM_CHANNEL_MODE.single ? 'Single' : 'Sweep'
            }
        />
    );
};

export default ToggleChannelModeView;
