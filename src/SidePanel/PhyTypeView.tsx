/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DTM, DTM_PHY_STRING } from 'nrf-dtm-js/src/DTM';
import { Dropdown } from 'pc-nrfconnect-shared';

import { getBoard } from '../reducers/deviceReducer';
import { getPhy, phyChanged } from '../reducers/settingsReducer';
import { getIsRunning } from '../reducers/testReducer';
import { fromPCA } from '../utils/boards';

const PhyTypeView = () => {
    const phy = useSelector(getPhy);
    const boardType = useSelector(getBoard);
    const isRunning = useSelector(getIsRunning);
    const dispatch = useDispatch();
    const compatibility = fromPCA(boardType);

    const items = Object.entries(compatibility.phy).map(([key, phyType]) => ({
        label: DTM_PHY_STRING[phyType],
        value: key,
    }));

    return (
        <Dropdown
            label="Physical layer"
            items={items}
            disabled={isRunning}
            onSelect={item => {
                dispatch(phyChanged(DTM.DTM_PARAMETER[item.value]));
            }}
            selectedItem={
                items.find(e => DTM.DTM_PARAMETER[e.value] === phy) ?? items[0]
            }
        />
    );
};

export default PhyTypeView;
