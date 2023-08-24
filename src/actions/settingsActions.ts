/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { AppThunk } from 'pc-nrfconnect-shared';

import {
    DTM_CHANNEL_MODE,
    dtmChannelModeChanged,
    sweepTimeChanged,
} from '../reducers/settingsReducer';
import { RootState } from '../reducers/types';

const channelModeChanged =
    (buttonClicked: string): AppThunk<RootState> =>
    dispatch => {
        if (buttonClicked === DTM_CHANNEL_MODE.single) {
            dispatch(sweepTimeChanged(0));
        }
        if (buttonClicked === DTM_CHANNEL_MODE.sweep) {
            dispatch(sweepTimeChanged(30));
        }
        dispatch(dtmChannelModeChanged(buttonClicked));
    };

export default channelModeChanged;
