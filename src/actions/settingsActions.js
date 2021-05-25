/* Copyright (c) 2015 - 2018, Nordic Semiconductor ASA
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

import { createAction } from '@reduxjs/toolkit';

import {
    bitpatternChanged,
    dtmChannelModeChanged,
    dtmHighChannelChanged,
    dtmLowChannelChanged,
    dtmSingleChannelChanged,
    dtmTestModeChanged,
    lengthChanged,
    modulationChanged,
    phyChanged,
    sweepTimeChanged as sweepTimeChangedAction,
    timeoutChanged,
    txPowerChanged,
} from '../reducers/settingsReducer';

export const DTM_TEST_MODE_BUTTON = {
    transmitter: 0,
    receiver: 1,
};

export const DTM_CHANNEL_MODE = {
    single: 'DTM_CHANNEL_MODE_SINGLE_ACTION',
    sweep: 'DTM_CHANNEL_MODE_SWEEP_ACTION',
};

export function channelModeChanged(buttonClicked) {
    return dispatch => {
        if (buttonClicked === DTM_CHANNEL_MODE.single) {
            dispatch(sweepTimeChanged(0));
        }
        if (buttonClicked === DTM_CHANNEL_MODE.sweep) {
            dispatch(sweepTimeChanged(30));
        }
        dispatch(dtmChannelModeChanged(buttonClicked));
    };
}

export const testModeChanged = createAction(dtmTestModeChanged);
export const singleChannelChanged = createAction(dtmSingleChannelChanged);
export const lowChannelChanged = createAction(dtmLowChannelChanged);
export const highChannelChanged = createAction(dtmHighChannelChanged);
export const sweepTimeChanged = createAction(sweepTimeChangedAction);
export const txPowerUpdated = createAction(txPowerChanged);
export const bitpatternUpdated = createAction(bitpatternChanged);
export const lengthUpdated = createAction(lengthChanged);
export const timeoutChanged = createAction(timeoutChanged);
export const phyChanged = createAction(phyChanged);
export const modulationChanged = createAction(modulationChanged);
