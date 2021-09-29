/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

// import React from 'react';

// import { render } from '../../utils/testUtils';
// import ChannelView from '../ChannelView';

import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen } from '../../utils/testUtils';
import ChannelView from '../ChannelView';

describe('Initial state', () => {
    test('should have single channel selected', () => {
        render(<ChannelView paneName="transmitter" />);

        const singleBtn = screen.getByRole(`button`, { name: /single/i });

        expect(singleBtn).toHaveClass('active');
    });

    test('should have sweep channel not selected', () => {
        render(<ChannelView paneName="transmitter" />);

        const sweepBtn = screen.getByRole(`button`, { name: /sweep/i });

        expect(sweepBtn).not.toHaveClass('active');
    });
});

describe('Select sweep', () => {
    test('should have sweep channel selected', () => {
        render(<ChannelView paneName="transmitter" />);

        const sweepBtn = screen.getByRole('button', { name: /sweep/i });
        userEvent.click(sweepBtn);

        expect(sweepBtn).toHaveClass('active');
    });

    test('should render two channel sliders', async () => {
        render(<ChannelView paneName="transmitter" />);

        userEvent.click(screen.getByRole('button', { name: /sweep/i }));

        const sliders = await screen.findAllByRole('slider');

        // Normal and double (2x) slider
        expect(sliders.length).toBe(3);
    });
});
