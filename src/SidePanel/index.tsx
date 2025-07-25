/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { Group, SidePanel } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { getIsRunning } from '../reducers/testReducer';
import { isReceiverPane, isTransmitterPane } from '../utils/panes';
import BaudRate from './BaudRate';
import ChannelView from './ChannelView';
import PacketView from './PacketView';
import PhyTypeView from './PhyTypeView';
import RunTestView from './RunTestView';
import Serialports from './Serialports';
import TimeoutView from './TimeoutView';
import ToggleChannelModeView from './ToggleChannelModeView';
import TransmitSetupView from './TransmitSetupView';

const AppSidePanelView = () => {
    const isTransmitter = useSelector(isTransmitterPane);
    const isReceiver = useSelector(isReceiverPane);
    const isRunning = useSelector(getIsRunning);

    return (
        <SidePanel className="sidepanel">
            {(isTransmitter || isReceiver) && (
                <>
                    <Serialports />
                    <BaudRate />
                    <Group heading="Channel mode" gap={4}>
                        <ToggleChannelModeView isRunning={isRunning} />
                    </Group>
                    <Group heading="Channel Settings" gap={4}>
                        <ChannelView />
                        {isTransmitter && <TransmitSetupView />}
                        <PhyTypeView />
                        {isTransmitter && <PacketView />}
                        <TimeoutView />
                    </Group>
                    <RunTestView />
                </>
            )}
        </SidePanel>
    );
};
export default AppSidePanelView;
