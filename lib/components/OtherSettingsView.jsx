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

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import { DTM_PHY_STRING } from 'nrf-dtm-js/src/DTM.js';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';

import { TEST_STATES } from '../actions/testActions';
import { fromPCA } from '../utils/boards';

const { idle } = TEST_STATES;


const phyTypeView = (boardType, phy, onPhyUpdated, testingState) => {
    const compatibility = fromPCA(boardType);
    const items = Object.keys(compatibility.phy).map(keyname => (
        <Dropdown.Item
            eventKey={keyname}
            onSelect={evt => onPhyUpdated(compatibility.phy[evt])}
        >
            {DTM_PHY_STRING[compatibility.phy[keyname]]}
        </Dropdown.Item>
    ));
    return (
        <div>
            <label htmlFor="PHYLabel">
                Physical layer
            </label>
            <br />
            <Dropdown.Toggle
                title={DTM_PHY_STRING[phy]}
                id="dropdown-variants-phy-type"
                disabled={testingState !== idle}
            >
                {items}
            </Dropdown.Toggle>
        </div>
    );
};

const OtherSettingsView = ({
    boardType,
    phy,
    onPhyUpdated,
    testingState,
}) => {
    const [open, setOpen] = useState(true);
    return (
        <div
            className="app-sidepanel-panel"
        >
            <Card
                collapsible="true"
                expanded={open.toString()}
                header="Other settings"
                onSelect={() => setOpen(!open)}
            >
                <div className="app-sidepanel-component-inputbox">
                    {phyTypeView(boardType, phy, onPhyUpdated, testingState)}
                </div>
            </Card>
        </div>
    );
};

OtherSettingsView.propTypes = {
    boardType: PropTypes.string,
    phy: PropTypes.number.isRequired,
    onPhyUpdated: PropTypes.func.isRequired,
    testingState: PropTypes.number.isRequired,
};

OtherSettingsView.defaultProps = {
    boardType: '',
};

export default OtherSettingsView;
