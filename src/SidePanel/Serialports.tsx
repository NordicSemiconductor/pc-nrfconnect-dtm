/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Group, truncateMiddle } from 'pc-nrfconnect-shared';

import { deselectDevice, setupDtm } from '../actions/testActions';
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
    const board = useSelector(getBoard);
    const selectedSerialport = useSelector(getSelectedSerialport);

    if (availablePorts.length <= 1) return null;

    const updateSerialPort = ({ value: port }: { value: string }) => {
        dispatch(deselectDevice());
        dispatch(serialportSelected(port));
        dispatch(setupDtm(port, board as string));
    };

    const dropdownItems = availablePorts.map(port => ({
        label: truncateMiddle(port, 20, 8),
        value: port as string,
    }));

    return (
        <Group heading="Serialport trace capture">
            <div className="serialport-selection">
                <Dropdown
                    disabled={isRunning}
                    onSelect={updateSerialPort}
                    items={dropdownItems}
                    defaultIndex={
                        selectedSerialport
                            ? availablePorts.indexOf(
                                  selectedSerialport as string
                              )
                            : 0
                    }
                />
            </div>
        </Group>
    );
};
