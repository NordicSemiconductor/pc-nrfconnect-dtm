/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dropdown,
    Group,
    truncateMiddle,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import {
    getSelectedSerialport,
    getSerialports,
    serialportSelected,
} from '../reducers/deviceReducer';
import { getIsRunning } from '../reducers/testReducer';

export default () => {
    const dispatch = useDispatch();
    const availablePorts = useSelector(getSerialports);
    const isRunning = useSelector(getIsRunning);
    const selectedSerialport = useSelector(getSelectedSerialport);

    if (availablePorts.length <= 1 || selectedSerialport === null) return null;

    const dropdownItems = availablePorts.map(port => ({
        label: truncateMiddle(port, 20, 8),
        value: port as string,
    }));

    return (
        <Group heading="Serial port">
            <Dropdown
                disabled={isRunning}
                onSelect={v => dispatch(serialportSelected(v.value))}
                items={dropdownItems}
                selectedItem={
                    dropdownItems.find(
                        e => e.value === (selectedSerialport as string)
                    ) ?? dropdownItems[0]
                }
            />
        </Group>
    );
};
