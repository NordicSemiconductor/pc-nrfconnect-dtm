/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StateSelector } from '@nordicsemiconductor/pc-nrfconnect-shared';

import channelModeChanged from '../actions/settingsActions';
import { ChannelMode } from '../dtm/types';
import { getChannelMode } from '../reducers/settingsReducer';

interface ToggleChannelModeViewProps {
    isRunning: boolean;
}

const ToggleChannelModeView = ({ isRunning }: ToggleChannelModeViewProps) => {
    const selected = useSelector(getChannelMode);

    const dispatch = useDispatch();

    const items = [
        { key: 'Single', value: ChannelMode.single },
        { key: 'Sweep', value: ChannelMode.sweep },
    ];

    return (
        <StateSelector
            items={items.map(e => e.key)}
            disabled={isRunning}
            onSelect={index => dispatch(channelModeChanged(items[index].value))}
            selectedItem={selected === ChannelMode.single ? 'Single' : 'Sweep'}
        />
    );
};

export default ToggleChannelModeView;
