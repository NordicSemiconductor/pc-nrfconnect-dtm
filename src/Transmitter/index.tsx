/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Main } from 'pc-nrfconnect-shared';

import WarningView from '../WarningView';
import TransmitterChartView from './TransmitterChartView';

const AppMainView = () => (
    <div className="d-flex flex-column h-100">
        <WarningView />
        <div className="position-relative flex-grow-1 overflow-hidden">
            <Main>
                <TransmitterChartView />
            </Main>
        </div>
    </div>
);

export default AppMainView;
