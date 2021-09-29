/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

// eslint-disable-next-line import/no-unresolved
import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import channelModeChanged from '../actions/settingsActions';
import { DTM_CHANNEL_MODE, getChannelMode } from '../reducers/settingsReducer';

interface ToggleChannelModeViewProps {
    isRunning: boolean;
}

const ToggleChannelModeView = ({ isRunning }: ToggleChannelModeViewProps) => {
    const selected = useSelector(getChannelMode);

    const dispatch = useDispatch();

    const selectionButton = (type: string, text: string) => (
        <Button
            // @ts-ignore -- Doesn't seem to be an easy way to use custom variants with TS
            variant={selected === type ? 'set' : 'unset'}
            onClick={() => dispatch(channelModeChanged(type))}
            active={selected === type}
            disabled={isRunning}
        >
            {text}
        </Button>
    );

    return (
        <ButtonGroup
            className={`w-100 d-flex flex-row channel-selection ${
                isRunning ? 'disabled' : ''
            }`}
        >
            {selectionButton(DTM_CHANNEL_MODE.single, 'Single')}
            {selectionButton(DTM_CHANNEL_MODE.sweep, 'Sweep')}
        </ButtonGroup>
    );
};

ToggleChannelModeView.propTypes = {
    isRunning: PropTypes.bool.isRequired,
};

export default ToggleChannelModeView;
