/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { DtmPhysicalLayer } from '../dtm/types';
import { getBoard } from '../reducers/deviceReducer';
import { getPhy, phyChanged } from '../reducers/settingsReducer';
import { getIsRunning } from '../reducers/testReducer';
import { fromPCA } from '../utils/boards';

export default () => {
    const phy = useSelector(getPhy);
    const boardType = useSelector(getBoard);
    const isRunning = useSelector(getIsRunning);
    const dispatch = useDispatch();
    const compatibility = fromPCA(boardType);

    const items = Object.entries(compatibility.phy).map(([, phyType]) => ({
        label: DtmPhysicalLayer[phyType],
        value: phyType,
    }));

    return (
        <Dropdown
            label="Physical layer"
            items={items}
            disabled={isRunning}
            onSelect={item => {
                dispatch(phyChanged(item.value));
            }}
            selectedItem={items.find(e => e.value === phy) ?? items[0]}
        />
    );
};
