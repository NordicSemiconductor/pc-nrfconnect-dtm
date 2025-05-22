/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { AppThunk } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { ChannelMode } from '../dtm/types';
import {
    dtmChannelModeChanged,
    sweepTimeChanged,
} from '../reducers/settingsReducer';

export default (buttonClicked: ChannelMode): AppThunk =>
    dispatch => {
        if (buttonClicked === ChannelMode.single) {
            dispatch(sweepTimeChanged(0));
        }
        if (buttonClicked === ChannelMode.sweep) {
            dispatch(sweepTimeChanged(30));
        }
        dispatch(dtmChannelModeChanged(buttonClicked));
    };
