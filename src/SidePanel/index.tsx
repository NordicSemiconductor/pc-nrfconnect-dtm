/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

// eslint-disable-next-line import/no-unresolved
import React from 'react';
import { useSelector } from 'react-redux';
import { Group, SidePanel } from 'pc-nrfconnect-shared';

import { paneName } from '../utils/panes';
import ChannelView from './ChannelView';
import PacketView from './PacketView';
import PhyTypeView from './PhyTypeView';
import RunTestView from './RunTestView';
import TimeoutView from './TimeoutView';
import TransmitSetupView from './TransmitSetupView';

import './sidepanel.scss';

const AppSidePanelView = () => {
    const selectedTestMode = useSelector(paneName);

    return (
        <SidePanel className="sidepanel">
            <Group heading="Channel mode">
                <ChannelView paneName={selectedTestMode} />
                {selectedTestMode === 'transmitter' && <TransmitSetupView />}
                <PhyTypeView />
                {selectedTestMode === 'transmitter' && <PacketView />}
                <TimeoutView />
            </Group>
            <RunTestView />
        </SidePanel>
    );
};
export default AppSidePanelView;
