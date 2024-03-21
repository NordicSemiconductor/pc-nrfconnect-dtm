/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { AppThunk, logger } from '@nordicsemiconductor/pc-nrfconnect-shared';
import { DTM, DTM_MODULATION_STRING, DTM_PHY_STRING } from 'nrf-dtm-js/src/DTM';

import { getSerialports, setDeviceReady } from '../reducers/deviceReducer';
import {
    DTM_CHANNEL_MODE,
    getBitpattern,
    getChannelMode,
    getChannelRange,
    getLength,
    getModulation,
    getPhy,
    getSingleChannel,
    getSweepTime,
    getTimeout,
    getTxPower,
} from '../reducers/settingsReducer';
import {
    actionSucceeded,
    endedChannel,
    getIsRunning,
    resetChannel,
    startedAction,
    startedChannel,
    stoppedAction,
} from '../reducers/testReducer';
import { RootState } from '../reducers/types';
import { communicationError } from '../reducers/warningReducer';
import { bleChannelsValues } from '../SidePanel/ChannelView';
import * as Constants from '../utils/constants';
import { paneName } from '../utils/panes';
import { clearCommunicationErrorWarning } from './warningActions';

export const DTM_BOARD_SELECTED_ACTION = 'DTM_BOARD_SELECTED_ACTION';
export const DTM_TEST_DONE = 'DTM_TEST_DONE';

type ChannelEvent = {
    type: string;
    action: string;
    channel: number;
    packets: number;
};

type TestStatus = {
    success: boolean;
    received: number;
    receivedPerChannel: number[];
    message: string;
};

const dtmStatisticsUpdated: AppThunk<RootState> =
    dispatch => (event: ChannelEvent) => {
        if (event.type === 'reset') {
            dispatch(resetChannel());
        } else if (event.action === 'started') {
            dispatch(startedChannel(event.channel));
        } else if (event.action === 'ended') {
            dispatch(
                endedChannel({
                    channel: event.channel,
                    received: event.packets,
                })
            );
        }
    };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dtm: any;

const setupTest = async ({
    txPower,
    length,
    modulationMode,
    phy,
}: {
    txPower: number;
    length: number;
    modulationMode: number;
    phy: number;
}) => {
    let res = await dtm.setupReset();
    if (!validateResult(res)) {
        logger.info('DTM setup reset command failed');
        return false;
    }

    res = await dtm.setTxPower(Constants.dbmValues[txPower]);
    if (!validateResult(res)) {
        logger.info(
            `DTM setup tx power command failed with ${Constants.dbmValues[txPower]} dbm`
        );
    }

    res = await dtm.setupLength(length);
    if (!validateResult(res)) {
        logger.info(`DTM setup length command failed with length ${length}`);
    }

    res = await dtm.setupModulation(modulationMode);
    if (!validateResult(res)) {
        logger.info(
            'DTM setup modulation command failed with parameter ' +
                `${DTM_MODULATION_STRING[modulationMode]}`
        );
    }

    res = await dtm.setupPhy(phy);
    if (!validateResult(res)) {
        logger.info(
            `DTM setup physical command failed with parameter ${DTM_PHY_STRING[phy]}`
        );
    }

    return true;
};

const validateResult = (res: number[] | undefined) =>
    typeof res === 'object' && res.length >= 2 && res[0] === 0 && res[1] === 0;

export const startTests =
    (): AppThunk<RootState> => async (dispatch, getState) => {
        const state = getState();

        const bitpattern = getBitpattern(state);
        const length = getLength(state);
        const singleChannel = getSingleChannel(state);
        const channelRange = getChannelRange(state);
        const sweepTime = getSweepTime(state);
        const timeoutms = getTimeout(state);
        const channelMode = getChannelMode(state);
        const txPower = getTxPower(state);
        const modulationMode = getModulation(state);
        const phy = getPhy(state);

        const singleChannelIndexed = bleChannelsValues.indexOf(singleChannel);
        const channelRangeIndexed = channelRange.map(channel =>
            bleChannelsValues.indexOf(channel)
        );

        const testMode = paneName(getState());

        const { single, sweep } = DTM_CHANNEL_MODE;

        logger.info('Running device setup');
        const setupSuccess = await setupTest({
            txPower,
            length,
            modulationMode,
            phy,
        });
        if (!setupSuccess) {
            const message =
                'Can not communicate with the device. ' +
                'Make sure it is not in use by another application' +
                `${
                    getSerialports(state)?.length > 1
                        ? ', that the correct serialport has been selected'
                        : ''
                }` +
                ' and that it has a Direct Test Mode compatible firmware.';
            logger.info(message);
            dispatch(communicationError(message));
            return;
        }
        dispatch(clearCommunicationErrorWarning());
        logger.info('Starting test');

        let testPromise;
        if (testMode === 'transmitter' && channelMode === single) {
            testPromise = dtm.singleChannelTransmitterTest(
                bitpattern,
                length,
                singleChannelIndexed,
                timeoutms
            );
        } else if (testMode === 'transmitter' && channelMode === sweep) {
            testPromise = dtm.sweepTransmitterTest(
                bitpattern,
                length,
                ...channelRangeIndexed,
                sweepTime,
                timeoutms
            );
        } else if (testMode === 'receiver' && channelMode === single) {
            // TODO: Figure out the importance of execution of single channel test,
            //   this solution does not give continuous upate, but probably captures more packets.
            // testPromise = dtm.singleChannelReceiverTest(
            //     singleChannel,
            //     timeout,
            // );

            // This solution works as sweep on a single channel, updates continuously
            testPromise = dtm.sweepReceiverTest(
                bitpattern,
                length,
                singleChannelIndexed,
                singleChannelIndexed,
                sweepTime,
                timeoutms
            );
        } else {
            testPromise = dtm.sweepReceiverTest(
                bitpattern,
                length,
                ...channelRangeIndexed,
                sweepTime,
                timeoutms
            );
        }

        testPromise.then((status: TestStatus) => {
            const { success, received, receivedPerChannel, message } = status;
            if (success) {
                let receivedChannels = receivedPerChannel;
                if (receivedChannels === undefined) {
                    receivedChannels = new Array(40).fill(0);

                    if (received !== undefined) {
                        receivedChannels[singleChannelIndexed] = received;
                    }
                }
                const testTypeStr =
                    testMode === 'transmitter' ? 'Transmitter' : 'Receiver';
                const packetsRcvStr =
                    testMode === 'transmitter'
                        ? ''
                        : `. Received ${received} packets.`;
                logger.info(
                    `${testTypeStr} test finished successfully${packetsRcvStr}`
                );
                dispatch(actionSucceeded(receivedChannels));
            } else {
                logger.info(`End test failed: ${message}`);
            }
        });

        dispatch(startedAction(testMode));
    };

export const endTests = (): AppThunk => {
    logger.info('Ending test');
    return async dispatch => {
        await dtm.endTest();
        dispatch(stoppedAction());
    };
};

export const selectDevice = (): AppThunk<RootState> => (dispatch, getState) => {
    dtm = new DTM(
        getState().app.device.selectedSerialport,
        getState().app.device.board
    );
    dtm.on('update', dispatch(dtmStatisticsUpdated));
    dtm.on('transport', (msg: string) => logger.debug(msg));
    dtm.on('log', (param: { message: string }) => {
        logger.info(param.message);
    });
    dispatch(setDeviceReady(true));
};

export const deselectDevice =
    (): AppThunk<RootState> => async (dispatch, getState) => {
        const isRunning = getIsRunning(getState());
        if (isRunning) {
            dispatch(endTests());
        }

        if (dtm.dtmTransport.port.isOpen) await dtm.dtmTransport.close();
        dtm = null;
    };
