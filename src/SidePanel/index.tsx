/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { Group, SidePanel } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { paneName } from '../utils/panes';
import ChannelView from './ChannelView';
import PacketView from './PacketView';
import PhyTypeView from './PhyTypeView';
import RunTestView from './RunTestView';
import Serialports from './Serialports';
import TimeoutView from './TimeoutView';
import TransmitSetupView from './TransmitSetupView';

const AppSidePanelView = () => {
    const selectedTestMode = useSelector(paneName);

    return (
        <SidePanel className="sidepanel">
            <Serialports />
            <Group heading="Channel mode" gap={4}>
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
