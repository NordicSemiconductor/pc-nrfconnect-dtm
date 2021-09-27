/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DTM_PHY_STRING } from 'nrf-dtm-js/src/DTM';

import { getBoard } from '../reducers/deviceReducer';
import { getPhy, phyChanged } from '../reducers/settingsReducer';
import { getIsRunning } from '../reducers/testReducer';
import { fromPCA } from '../utils/boards';
import { Dropdown, DropdownItem } from './dropdown';

const PhyTypeView = () => {
    const phy = useSelector(getPhy);
    const boardType = useSelector(getBoard);
    const isRunning = useSelector(getIsRunning);
    const dispatch = useDispatch();
    const compatibility = fromPCA(boardType);

    const items = Object.values(compatibility.phy).map((value: number) => (
        <DropdownItem
            key={value}
            title={DTM_PHY_STRING[value]}
            onSelect={() => dispatch(phyChanged(value))}
        />
    ));

    return (
        <Dropdown
            label="Physical layer"
            title={DTM_PHY_STRING[phy]}
            id="dropdown-variants-phy-type"
            disabled={isRunning}
        >
            {items}
        </Dropdown>
    );
};

export default PhyTypeView;
