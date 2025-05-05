/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Group } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { baudRateSelected, getBaudRate } from '../reducers/deviceReducer';
import { getIsRunning } from '../reducers/testReducer';

const validBaudRates = [1200, 2400, 9600, 14400, 19200, 38400, 57600, 115200];
export default () => {
    const dispatch = useDispatch();
    const baudRate = useSelector(getBaudRate);
    const isRunning = useSelector(getIsRunning);

    const dropdownItems = validBaudRates.map(v => ({
        label: v,
        value: v,
    })).reverse();

    return (
        <Group heading="Baud Rate">
            <Dropdown
                disabled={isRunning}
                onSelect={v => dispatch(baudRateSelected(v.value))}
                items={dropdownItems}
                selectedItem={
                    dropdownItems.find(e => e.value === baudRate) ??
                    dropdownItems[0]
                }
            />
        </Group>
    );
};
