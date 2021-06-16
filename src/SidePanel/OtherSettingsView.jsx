/* Copyright (c) 2015 - 2021, Nordic Semiconductor ASA
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
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { DTM_PHY_STRING } from 'nrf-dtm-js/src/DTM';

import { getBoard } from '../reducers/deviceReducer';
import { getPhy, phyChanged } from '../reducers/settingsReducer';
import { getIsRunning } from '../reducers/testReducer';
import { fromPCA } from '../utils/boards';
import { Dropdown, DropdownItem } from './dropdown';

const phyTypeView = (boardType, phy, onPhyUpdated, isRunning) => {
    const compatibility = fromPCA(boardType);
    const items = Object.keys(compatibility.phy).map(keyname => (
        <DropdownItem
            key={keyname}
            title={DTM_PHY_STRING[compatibility.phy[keyname]]}
            onSelect={() => onPhyUpdated(compatibility.phy[keyname])}
        />
    ));

    return (
        <Form.Group controlId="formTimeoutSelect">
            <Dropdown
                label="Physical layer"
                title={DTM_PHY_STRING[phy]}
                id="dropdown-variants-phy-type"
                disabled={isRunning}
            >
                {items}
            </Dropdown>
        </Form.Group>
    );
};

const OtherSettingsView = () => {
    const phy = useSelector(getPhy);
    const boardType = useSelector(getBoard);
    const isRunning = useSelector(getIsRunning);

    const dispatch = useDispatch();

    return (
        <div className="app-sidepanel-panel">
            {phyTypeView(
                boardType,
                phy,
                value => dispatch(phyChanged(value)),
                isRunning
            )}
        </div>
    );
};

export default OtherSettingsView;
