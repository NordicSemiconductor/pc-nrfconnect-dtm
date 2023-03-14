/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import { setDeviceReady } from '../reducers/deviceReducer';
import RunTestView from '../SidePanel/RunTestView';
import { render, screen } from '../utils/testUtils';

jest.mock('nrf-dtm-js/src/DTM', () => ({
    DTM: {
        DTM_PARAMETER: {
            PHY_LE_1M: 0x01,
        },
    },
}));

describe('Initial state with unselected device', () => {
    it('should render start button disabled', () => {
        render(<RunTestView />);

        const startButton = screen.getByRole('button', { name: /start test/i });

        expect(startButton).toBeDisabled();
    });
});

describe('State with selected device', () => {
    it('should render start button enabled', () => {
        render(<RunTestView />, [setDeviceReady(true)]);

        const startButton = screen.getByRole('button', { name: /start test/i });

        expect(startButton).toBeEnabled();
    });
});
