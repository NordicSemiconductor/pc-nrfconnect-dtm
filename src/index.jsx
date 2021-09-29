/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { App } from 'pc-nrfconnect-shared';

import DeviceSelector from './DeviceSelector';
import Receiver from './Receiver';
import appReducer from './reducers';
import SidePanel from './SidePanel';
import Transmitter from './Transmitter';

import './index.scss';

export default () => (
    <App
        appReducer={appReducer}
        deviceSelect={<DeviceSelector />}
        sidePanel={<SidePanel />}
        panes={[
            {
                name: 'Transmitter',
                Main: Transmitter,
            },
            { name: 'Receiver', Main: Receiver },
        ]}
    />
);
