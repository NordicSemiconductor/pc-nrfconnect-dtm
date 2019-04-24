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

import React, { useState } from 'react';
import { FormControl, FormGroup, ControlLabel, Panel  } from 'react-bootstrap';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import PropTypes from 'prop-types';
import { logger } from 'nrfconnect/core';
import * as SettingsActions from '../actions/settingsActions';
import ToggleChannelModeView from '../containers/toggleChannelModeView';

const ChannelSlider = (label, currentValue, changedFunc) => (
    <div>
        <label>{label}</label><br />
        <Slider
            value={currentValue}
            onChange={value => changedFunc(value)}
            max={39}
            min={0}
            labels={{0:'0', 39:'39'}}
            disabled={null}
        />
    </div>
);

const SweepTime = (value, changedFunc) => (
    <form>
    <FormGroup controlId="formSweepTimeSelect">
      <ControlLabel>Sweep time (ms)</ControlLabel>
      <FormControl onChange={evt => changedFunc(evt.target.value)}
      componentClass="input" value={value}  min={20} step={10} type="number" bsSize="sm" />
    </FormGroup>
    </form>
);

const ChannelView = ({
        channel,
        channelMode,
        channelLow,
        channelHigh,
        sweepTime,
        onChannelChanged,
        onChannelLowChanged,
        onChannelHighChanged,
        onSweepTimeChanged,
    }) => {
    const [open, setOpen] = useState(true);

    return (
        <div className="app-sidepanel-component-view">
            <Panel collapsible
            expanded={open}
            header='Channel settings'
            onSelect={() => setOpen(!open)}>
                <ToggleChannelModeView />
                {channelMode === SettingsActions.DTM_CHANNEL_MODE.single &&
                ChannelSlider('Channel', channel, onChannelChanged)
                }
                {channelMode === SettingsActions.DTM_CHANNEL_MODE.sweep &&
                ChannelSlider('Channel Low', channelLow, onChannelLowChanged)
                }
                {channelMode === SettingsActions.DTM_CHANNEL_MODE.sweep &&
                ChannelSlider('Channel High', channelHigh, onChannelHighChanged)
                }
                {channelMode === SettingsActions.DTM_CHANNEL_MODE.sweep &&
                SweepTime(sweepTime, onSweepTimeChanged)
                }
            </Panel>
        </div>
    );
}

ChannelView.propTypes = {
    channelMode: PropTypes.number.isRequired,
    channel: PropTypes.number.isRequired,
    channelLow: PropTypes.number.isRequired,
    channelHigh: PropTypes.number.isRequired,
    sweepTime: PropTypes.number.isRequired,
    onChannelChanged: PropTypes.func.isRequired,
    onChannelLowChanged: PropTypes.func.isRequired,
    onChannelHighChanged: PropTypes.func.isRequired,
    onSweepTimeChanged: PropTypes.func.isRequired,
};

export default ChannelView;
