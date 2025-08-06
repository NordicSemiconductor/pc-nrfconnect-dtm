/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { AppThunk, logger } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { DTM } from '../dtm/DTM';
import { ChannelMode } from '../dtm/types';
import { getSerialports } from '../reducers/deviceReducer';
import {
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
    actionStopped,
    actionSucceeded,
    startedAction,
} from '../reducers/testReducer';
import { RootState } from '../reducers/types';
import { communicationError } from '../reducers/warningReducer';
import { bleChannelsValues } from '../SidePanel/ChannelView';
import { paneName } from '../utils/panes';
import { getDTM } from './dtm';
import { clearCommunicationErrorWarning } from './warningActions';

export const DTM_BOARD_SELECTED_ACTION = 'DTM_BOARD_SELECTED_ACTION';
export const DTM_TEST_DONE = 'DTM_TEST_DONE';

const setupTest = async ({
    txPower,
    length,
    modulationMode,
    phy,
    dtm,
}: {
    txPower: number;
    length: number;
    modulationMode: number;
    phy: number;
    dtm: DTM;
}) => {
    await dtm.setupReset();
    await dtm.setTxPower(txPower);
    await dtm.setupLength(length);
    await dtm.setupModulation(modulationMode);
    await dtm.setupPhy(phy);
};

export const startTests =
    (): AppThunk<RootState, Promise<void>> => async (dispatch, getState) => {
        const state = getState();

        // Type is optional but it is defined by deviceselector
        // It will only ever be replaced by valid values otherwise
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

        const errorMessage =
            'Cannot communicate with the device. ' +
            'Make sure it is not in use by another application' +
            `${
                getSerialports(state)?.length > 1
                    ? ', that the correct serial port has been selected'
                    : ''
            }` +
            ', and that it uses firmware compatible with Direct Test Mode.';

        let dtm: DTM | undefined;
        try {
            dtm = await dispatch(getDTM());

            const testMode = paneName(getState());

            logger.info('Running device setup');
            await setupTest({
                txPower,
                length,
                modulationMode,
                phy,
                dtm,
            });

            dispatch(clearCommunicationErrorWarning());
            logger.info('Starting test');

            let testPromise;
            if (
                testMode === 'transmitter' &&
                channelMode === ChannelMode.single
            ) {
                testPromise = dtm.singleChannelTransmitterTest(
                    bitpattern,
                    length,
                    singleChannelIndexed,
                    timeoutms
                );
            } else if (
                testMode === 'transmitter' &&
                channelMode === ChannelMode.sweep
            ) {
                testPromise = dtm.sweepTransmitterTest(
                    bitpattern,
                    length,
                    bleChannelsValues.indexOf(Math.min(...channelRange)),
                    bleChannelsValues.indexOf(Math.max(...channelRange)),
                    sweepTime,
                    timeoutms
                );
            } else if (
                testMode === 'receiver' &&
                channelMode === ChannelMode.single
            ) {
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
                    bleChannelsValues.indexOf(Math.min(...channelRange)),
                    bleChannelsValues.indexOf(Math.max(...channelRange)),
                    sweepTime,
                    timeoutms
                );
            }

            testPromise.then(status => {
                if (status.type === 'error') {
                    logger.info(`End test failed: ${status.message}`);
                    dispatch(actionStopped());
                } else if (status.type === 'transmitter') {
                    logger.info(`Transmitter test finished successfully.`);
                    dispatch(actionSucceeded(new Array(40).fill(0)));
                } else if (status.type === 'receiver') {
                    dispatch(actionSucceeded(status.receivedPerChannel));
                    logger.info(
                        `Transmitter test finished successfully. Received ${status.receivedPerChannel.reduce(
                            (a, b) => a + b,
                            0
                        )} packets.`
                    );
                }
            });

            dispatch(startedAction(testMode));
        } catch (e) {
            dtm?.endTest().catch(() => undefined);
            logger.info(errorMessage);
            dispatch(communicationError(errorMessage));
        }
    };

export const endTests =
    (): AppThunk<RootState, Promise<void>> => async dispatch => {
        logger.info('Ending test');
        (await dispatch(getDTM()))
            .endTest()
            .finally(() => dispatch(actionStopped()));
    };
