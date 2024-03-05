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
    persistSerialPortOptions,
    truncateMiddle,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { deselectDevice, selectDevice } from '../actions/testActions';
import {
    getBoard,
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
    const board = useSelector(getBoard);

    if (availablePorts.length <= 1 || selectedSerialport === null) return null;

    const updateSerialPort = async ({ value: port }: { value: string }) => {
        dispatch(serialportSelected(port));

        // baudRate isn't used but required by types
        dispatch(persistSerialPortOptions({ path: port, baudRate: 9600 }));
        if (board === null) return;
        await dispatch(deselectDevice());
        dispatch(selectDevice());
    };

    const dropdownItems = availablePorts.map(port => ({
        label: truncateMiddle(port, 20, 8),
        value: port as string,
    }));

    return (
        <Group heading="Serialport">
            <Dropdown
                disabled={isRunning}
                onSelect={updateSerialPort}
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
