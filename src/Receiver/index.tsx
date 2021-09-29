/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Main } from 'pc-nrfconnect-shared';

import WarningView from '../WarningView';
import ReceiverChartView from './ReceiverChartView';

const AppMainView = () => (
    <Main>
        <WarningView />
        <ReceiverChartView />
    </Main>
);

export default AppMainView;
