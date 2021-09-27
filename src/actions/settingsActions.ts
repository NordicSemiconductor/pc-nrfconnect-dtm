/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import {
    DTM_CHANNEL_MODE,
    dtmChannelModeChanged,
    sweepTimeChanged,
} from '../reducers/settingsReducer';
import { TDispatch } from '../reducers/types';

function channelModeChanged(buttonClicked: string) {
    return (dispatch: TDispatch) => {
        if (buttonClicked === DTM_CHANNEL_MODE.single) {
            dispatch(sweepTimeChanged(0));
        }
        if (buttonClicked === DTM_CHANNEL_MODE.sweep) {
            dispatch(sweepTimeChanged(30));
        }
        dispatch(dtmChannelModeChanged(buttonClicked));
    };
}

export default channelModeChanged;
