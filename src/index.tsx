/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import {
    App,
    render,
    telemetry,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import DeviceSelector from './DeviceSelector';
import Receiver from './Receiver';
import appReducer from './reducers';
import SidePanel from './SidePanel';
import Transmitter from './Transmitter';
import { Panes } from './utils/panes';

import './index.scss';

telemetry.enableTelemetry();

render(
    <App
        appReducer={appReducer}
        deviceSelect={<DeviceSelector />}
        sidePanel={<SidePanel />}
        panes={[
            {
                name: Panes.TRANSMITTER,
                Main: Transmitter,
            },
            {
                name: Panes.RECEIVER,
                Main: Receiver,
            },
        ]}
    />
);
