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

import React from 'react';
import { FormControl, FormGroup, ControlLabel, Panel  } from 'react-bootstrap';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import PropTypes from 'prop-types';
import { logger } from 'nrfconnect/core';
import * as SettingsActions from '../actions/settingsActions';
import ToggleChannelModeView from '../containers/toggleChannelModeView';

class ChannelView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open:true,
        }
    }

    eventToChannelNumber(evt) {
        logger.info(`Event ${evt.target.value}`)
        return Math.max(0, Math.min( 39, evt.target.value));
    }

    multiChannelView() {

/*
        return (
            <div>
            <FormGroup controlId="formChannelLowSelect">
              <ControlLabel>Channel Low</ControlLabel>
              <FormControl onChange={(evt) => this.props.onChannelLowChanged(this.eventToChannelNumber(evt))}
              componentClass="input" value={this.props.channelLow} min={0} max={39} type="number" bsSize="sm" />
            </FormGroup>
            <FormGroup controlId="formChannelHighSelect">
              <ControlLabel>Channel High</ControlLabel>
              <FormControl onChange={(evt) => this.props.onChannelHighChanged(this.eventToChannelNumber(evt))}
              componentClass="input" value={this.props.channelHigh} min={0} max={39} type="number" bsSize="sm" />
            </FormGroup>
            </div>
        )*/
        return (
            <div className="app-multi-channel-view">

            <label>Channel</label><br />
            <ReactBootstrapSlider
                value={[this.props.channel]}
                slideStop={event => this.props.onChannelChanged(this.eventToChannelNumber(event))}
                max={39}
                min={0}
                ticks={[0, 39]}
                ticks_labels={['0', '39']}
                disabled={null}
            />
            <form>


            <FormGroup controlId="formSweepTimeSelect">
              <ControlLabel>Sweep time (ms)</ControlLabel>
              <FormControl onChange={evt => this.props.onSweepTimeChanged(evt.target.value)}
              componentClass="input" value={this.props.sweepTime}  min={20} step={10} type="number" bsSize="sm" />
            </FormGroup>
            </form>
            </div>
        );
    }

    singleChannelView() {
        /*return (
            <div className="app-single-channel-view">
            <form>
            <FormGroup controlId="formControlsSelect">
              <ControlLabel>Channel</ControlLabel>
              <FormControl onChange={(evt) => this.props.onChannelChanged(this.eventToChannelNumber(evt))}
              componentClass="input" value={this.props.channel} min={0} max={39} type="number" bsSize="sm" />
            </FormGroup>
            </form>
            </div>
        );*/
        return (
            <div>
            <label>Channel</label><br />
            <ReactBootstrapSlider
                value={this.props.channel}
                slideStop={event => this.props.onChannelChanged(this.eventToChannelNumber(event))}
                max={39}
                min={0}
                ticks={[0, 39]}
                ticks_labels={['0', '39']}
                disabled={null}
            />
            </div>
        )
    }

    togglePanel() {
        this.setState((prevState, props) => {
            return {open: !prevState.open};
        });
    }

    render() {
        let view;
        if (SettingsActions.DTM_CHANNEL_MODE.single === this.props.channelMode) {
            view = this.singleChannelView();
        } else {
            view = this.multiChannelView();
        }

        return (
            <div>

                <Panel collapsible
                expanded={this.state.open}
                header='Select channels'
                onSelect={() => this.togglePanel()}>
                <ToggleChannelModeView />
                {view}
                </Panel>
            </div>
        );
    }
};

ChannelView.propTypes = {
    channel: PropTypes.number.isRequired,
    channelLow: PropTypes.number.isRequired,
    channelHigh: PropTypes.number.isRequired,
    sweepTime: PropTypes.number.isRequired,
};

export default ChannelView;
