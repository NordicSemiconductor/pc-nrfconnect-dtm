/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

/* eslint-disable no-await-in-loop */
/* eslint-disable no-bitwise */

import { logger } from '@nordicsemiconductor/pc-nrfconnect-shared';
import EventEmitter from 'events';

import * as Constants from '../utils/constants';
import {
    DTM_CONTROL,
    DTM_DC,
    DTM_EVENT,
    DTM_PARAMETER,
    DTMTransport,
} from './DTM_transport';
import { DtmModulationMode, DtmPacketType, DtmPhysicalLayer } from './types';

type ErrorTestStatus = {
    type: 'error';
    message: string;
};

type TransmitterTestStatus = {
    type: 'transmitter';
};

type ReceiverTestStatus = {
    type: 'receiver';
    receivedPerChannel: number[];
};

type TestStatus = ErrorTestStatus | TransmitterTestStatus | ReceiverTestStatus;

function channelToFrequency(channel: number) {
    return 2402 + 2 * channel;
}

function reportSuccess(report: number[]) {
    return (report[0] & 0x01) === 0;
}

export class DTM {
    #dtmTransport: DTMTransport;

    // Setting default paramters
    #lengthPayload = 1;
    #modulationPayload: DtmModulationMode = DtmModulationMode.Standard;
    #phyPayload: DtmPhysicalLayer = DtmPhysicalLayer['LE 1Mbps'];
    #dbmPayload = 0;
    #selectedTimer = 0;
    #isTransmitting = false;
    #isReceiving = false;
    #timedOut = false;
    #sweepTimedOut = false;
    #timeoutEvent?: NodeJS.Timeout;
    #dbmPayloadtimedOut?: NodeJS.Timeout;
    #onEndEvent?: (value: number) => void;
    #eventEmiter = new EventEmitter();

    constructor(comName: string, baudRate: number) {
        this.#dtmTransport = new DTMTransport(comName, baudRate);
    }

    onReset(listiner: () => void) {
        this.#eventEmiter.on('reset', listiner);
        return () => {
            this.#eventEmiter.removeListener('reset', listiner);
        };
    }

    onStarted(
        listiner: (event: {
            type: 'transmitter' | 'receiver';
            channel: number;
        }) => void
    ) {
        this.#eventEmiter.on('started', listiner);
        return () => {
            this.#eventEmiter.removeListener('started', listiner);
        };
    }

    onEnded(
        listiner: (event: {
            type: 'transmitter' | 'receiver';
            channel: number;
            packets?: number;
        }) => void
    ) {
        this.#eventEmiter.on('ended', listiner);
        return () => {
            this.#eventEmiter.removeListener('ended', listiner);
        };
    }

    #resetEvent() {
        this.#eventEmiter.emit('reset');
    }

    #startedTransmitterEvent(channel: number) {
        this.#eventEmiter.emit('started', { type: 'transmitter', channel });
        return () =>
            this.#eventEmiter.emit('ended', {
                type: 'transmitter',
                channel,
            });
    }

    #startedReceiverEvent(channel: number) {
        this.#eventEmiter.emit('started', { type: 'receiver', channel });
        return (packets: number) =>
            this.#eventEmiter.emit('ended', {
                type: 'receiver',
                channel,
                packets,
            });
    }

    startTimeoutEvent(rxtxFlag: () => boolean, timeout: number) {
        let timeoutEvent;
        this.#timedOut = false;
        if (timeout > 0) {
            timeoutEvent = setTimeout(() => {
                this.#timedOut = true;
                if (rxtxFlag()) {
                    if (!this.#sweepTimedOut) {
                        this.endCurrentTest();
                    }
                }
            }, timeout);
        }
        return timeoutEvent;
    }

    startSweepTimeoutEvent(rxtxFlag: () => boolean, timeout: number) {
        let timeoutEvent;
        this.#sweepTimedOut = false;
        if (timeout > 0) {
            timeoutEvent = setTimeout(() => {
                this.#sweepTimedOut = true;
                if (rxtxFlag()) {
                    if (!this.#timedOut) {
                        this.endCurrentTest();
                    }
                }
            }, timeout);
        }
        return timeoutEvent;
    }

    endEventDataReceived() {
        return new Promise<{ received: number }>(done => {
            this.#onEndEvent = received => {
                this.#onEndEvent = undefined;
                done({ received });
            };
        });
    }

    async endCurrentTest() {
        const cmd = DTMTransport.createEndCMD();
        const response = await this.#dtmTransport.sendCMD(cmd);
        const event = (response[0] & 0x80) >> 7;
        let receivedPackets = 0;

        if (event === DTM_EVENT.LE_PACKET_REPORT_EVENT) {
            const MSB = response[0] & 0x3f;
            const LSB = response[1];
            receivedPackets = (MSB << 8) | LSB;
        }
        if (this.#onEndEvent) {
            this.#onEndEvent(receivedPackets);
        }
        return response;
    }

    static carrierTestCMD(
        frequency: number,
        length: number,
        bitpattern: number
    ) {
        let lengthParam = length & 0x3f;
        if (bitpattern === DtmPacketType['Constant carrier']) {
            lengthParam = 0;
        }
        return DTMTransport.createTransmitterCMD(
            frequency,
            lengthParam,
            bitpattern
        );
    }

    static carrierTestStudioCMD(
        frequency: number,
        length: number,
        bitpattern: number
    ) {
        let lengthParam = length & 0x3f;
        if (bitpattern === DtmPacketType['Constant carrier']) {
            lengthParam = 1;
        }
        return DTMTransport.createTransmitterCMD(
            frequency,
            lengthParam,
            bitpattern
        );
    }

    /**
     * Set TX power for transmissions
     *
     * @param {number} dbm signal strength [-40dbm, +8dbm]
     *
     * @returns {object} response from device
     */
    async setTxPower(dbm = this.#dbmPayload) {
        this.#dbmPayload = dbm;
        const value = dbm & 0x3f;
        const cmd = DTMTransport.createTxPowerCMD(value);
        try {
            return await this.#dtmTransport.sendCMD(cmd);
        } catch {
            throw new Error(
                `DTM setup tx power command failed with ${Constants.dbmValues[dbm]} dbm`
            );
        }
    }

    /**
     * Select timer to use
     *
     * @param {number} timer to use
     *
     * @returns {object} response from device
     */
    async selectTimer(timer = this.#selectedTimer) {
        this.#selectedTimer = timer;
        const cmd = DTMTransport.createSelectTimerCMD(timer);
        const response = await this.#dtmTransport.sendCMD(cmd);
        return response;
    }

    /**
     * Run setup reset command
     *
     * @returns {object} response from device
     */
    async setupReset() {
        const cmd = DTMTransport.createSetupCMD(
            DTM_CONTROL.RESET,
            DTM_PARAMETER.DEFAULT,
            DTM_DC.DEFAULT
        );
        try {
            return await this.#dtmTransport.sendCMD(cmd);
        } catch {
            throw new Error('DTM setup reset command failed');
        }
    }

    /**
     * Setup packet length
     *
     * @param {number} length of transmit packets
     *
     * @returns {object} response from device
     */
    async setupLength(length = this.#lengthPayload) {
        this.#lengthPayload = length;
        const lengthBits = length >> 6;
        const cmd = DTMTransport.createSetupCMD(
            DTM_CONTROL.ENABLE_LENGTH,
            lengthBits,
            DTM_DC.DEFAULT
        );
        try {
            const response = await this.#dtmTransport.sendCMD(cmd);
            return response;
        } catch {
            throw new Error(
                `DTM setup length command failed with length ${length}`
            );
        }
    }

    /**
     * Setup physical layer (PHY)
     *
     * @param {number} phy setting selected [PHY_LE_1M, PHY_LE_2M,
      PHY_LE_CODED_S2, PHY_LE_CODED_S8]
     *
     * @returns {object} response from device
     */
    async setupPhy(phy = this.#phyPayload) {
        this.#phyPayload = phy;
        const cmd = DTMTransport.createSetupCMD(
            DTM_CONTROL.PHY,
            phy,
            DTM_DC.DEFAULT
        );
        try {
            const response = await this.#dtmTransport.sendCMD(cmd);
            return response;
        } catch {
            throw new Error(
                `DTM setup physical command failed with parameter ${DtmPhysicalLayer[phy]}`
            );
        }
    }

    /**
     * Setup modulation type
     *
     * @param {number} modulation setting selected [STANDARD_MODULATION_INDEX,
     STABLE_MODULATION_INDEX]
     *
     * @returns {object} response from device
     */
    async setupModulation(modulation = this.#modulationPayload) {
        this.#modulationPayload = modulation;
        const cmd = DTMTransport.createSetupCMD(
            DTM_CONTROL.MODULATION,
            modulation,
            DTM_DC.DEFAULT
        );
        try {
            const response = await this.#dtmTransport.sendCMD(cmd);
            return response;
        } catch {
            throw new Error(
                'DTM setup modulation command failed with parameter ' +
                    `${DtmModulationMode[modulation]}`
            );
        }
    }

    /**
     * Read device features
     *
     * @returns {object} response from device
     */
    async setupReadFeatures() {
        const cmd = DTMTransport.createSetupCMD(
            DTM_CONTROL.FEATURES,
            0,
            DTM_DC.DEFAULT
        );
        const response = await this.#dtmTransport.sendCMD(cmd);
        return response;
    }

    /**
     * Read supported max Tx/Rx
     *
     * @param {number} parameter is the type of information to read [
     SUPPORTED_MAX_TX_OCTETS,
     SUPPORTED_MAX_TX_TIME,
     SUPPORTED_MAX_RX_OCTETS,
     SUPPORTED_MAX_RX_TIME]
     *
     * @returns {object} response from device
     */
    async setupReadSupportedRxTx(parameter: number) {
        const cmd = DTMTransport.createSetupCMD(
            DTM_CONTROL.TXRX,
            parameter,
            DTM_DC.DEFAULT
        );
        const response = await this.#dtmTransport.sendCMD(cmd);
        return response;
    }

    /**
     * Run DTM transmitter test using a single channel
     *
     * @param {number} bitpattern to use
     * @param {number} length in bytes of transmit packets
     * @param {number} channel to use for transmission
     * @param {number} timeout of test in milliseconds. 0 disables timeout.
     *
     * @returns {object} object containing success state and number of received packets
     */
    async singleChannelTransmitterTest(
        bitpattern: number,
        length: number,
        channel: number,
        timeout = 0
    ): Promise<TransmitterTestStatus | ErrorTestStatus> {
        this.#resetEvent();
        if (this.#isTransmitting) {
            // Stop previous transmission
        }
        this.#isTransmitting = true;
        this.#timeoutEvent = this.startTimeoutEvent(
            () => this.#isTransmitting,
            timeout
        );
        this.#sweepTimedOut = false;
        this.#timedOut = false;

        const frequency = channelToFrequency(channel);
        const cmd = DTM.carrierTestCMD(frequency, length, bitpattern);
        const response = await this.#dtmTransport.sendCMD(cmd);

        if (!reportSuccess(response)) {
            clearTimeout(this.#timeoutEvent);
            return { type: 'error', message: 'Could not start transmission.' };
        }
        const endEvent = this.#startedTransmitterEvent(channel);
        await this.endEventDataReceived();
        endEvent();
        clearTimeout(this.#timeoutEvent);
        return {
            type: 'transmitter',
        };
    }

    /**
     * Run DTM transmitter test using a range of channels
     *
     * @param {number} bitpattern to use
     * @param {number} length in bytes of transmit packets
     * @param {number} channelLow is the fist channel in the range
      to use for sweep transmission.
     * @param {number} channelHigh is the last channel in the range
      to use for sweep transmission.
     * @param {number} sweepTime is the time in milliseconds before
      moving on to the next channel in the sweep range.
     * @param {number} timeout of test in milliseconds. 0 disables timeout.
     * @param {boolean} randomPattern is true for random channel sweep
      pattern, false for sequential channel sweep.
     *
     * @returns {object} object containing success state and number of received packets
     */
    async sweepTransmitterTest(
        bitpattern: number,
        length: number,
        channelLow: number,
        channelHigh: number,
        sweepTime = 1000,
        timeout = 0,
        randomPattern = false
    ): Promise<TestStatus> {
        this.#resetEvent();
        if (this.#isTransmitting) {
            // Stop previous transmission
        }
        this.#isTransmitting = false;
        this.#timeoutEvent = this.startTimeoutEvent(
            () => this.#isTransmitting,
            timeout
        );
        let currentChannelIdx = 0;
        do {
            const frequency = channelToFrequency(
                channelLow + currentChannelIdx
            );
            this.#sweepTimedOut = false;
            this.#isTransmitting = false;

            if (this.#timedOut) {
                // eslint-disable-next-line
                continue;
            }

            const cmd = DTM.carrierTestCMD(frequency, length, bitpattern);
            const endEventDataReceivedEvt = this.endEventDataReceived();
            const sendCMDPromise = this.#dtmTransport.sendCMD(cmd);
            if (this.#timedOut) {
                // eslint-disable-next-line
                continue;
            }

            const response = await sendCMDPromise;
            this.#isTransmitting = true;

            if (!reportSuccess(response)) {
                this.#isTransmitting = false;
                clearTimeout(this.#timeoutEvent);
                return {
                    type: 'error',
                    message: 'Could not start transmission.',
                };
            }
            const endEvent = this.#startedTransmitterEvent(
                channelLow + currentChannelIdx
            );
            const sweepTimeoutEvent = this.startSweepTimeoutEvent(
                () => this.#isTransmitting,
                sweepTime
            );
            this.#sweepTimedOut = false;
            if (this.#timedOut) {
                this.endCurrentTest();
            }

            await endEventDataReceivedEvt;
            clearTimeout(sweepTimeoutEvent);

            endEvent();

            if (randomPattern) {
                currentChannelIdx = Math.floor(
                    Math.random() * (channelHigh - channelLow)
                );
            } else {
                currentChannelIdx =
                    (currentChannelIdx + 1) % (channelHigh - channelLow + 1);
            }
        } while (this.#isTransmitting && !this.#timedOut);

        clearTimeout(this.#timeoutEvent);
        return { type: 'transmitter' };
    }

    /**
     * Run DTM receiver test using a single channel
     *
     * @param {number} bitpattern to use
     * @param {number} length in bytes of transmit packets
     * @param {number} channel to use for transmission
     * @param {number} timeout of test in milliseconds. 0 disables timeout.
     *
     * @returns {object} object containing success state and number of received packets
     */
    async singleChannelReceiverTest(
        bitpattern: number,
        length: number,
        channel: number,
        timeout = 0
    ): Promise<ReceiverTestStatus | ErrorTestStatus> {
        this.#resetEvent();
        if (this.#isReceiving) {
            // Stop previous receiver
        }
        this.#isReceiving = true;
        this.#timeoutEvent = this.startTimeoutEvent(
            () => this.#isReceiving,
            timeout
        );
        this.#timedOut = false;
        this.#sweepTimedOut = false;

        const frequency = channelToFrequency(channel);
        const cmd = DTMTransport.createReceiverCMD(
            frequency,
            length,
            bitpattern
        );
        const endEventDataReceivedEvt = this.endEventDataReceived();
        const response = await this.#dtmTransport.sendCMD(cmd);

        if (!reportSuccess(response)) {
            clearTimeout(this.#timeoutEvent);
            return { type: 'error', message: 'Could not start receiver.' };
        }

        const endEvent = this.#startedReceiverEvent(channel);
        const status = await endEventDataReceivedEvt;
        clearTimeout(this.#timeoutEvent);
        endEvent(status.received);

        const receivedPerChannel = new Array(40).fill(0);
        receivedPerChannel[channel] = status.received;
        return {
            type: 'receiver',
            receivedPerChannel,
        };
    }

    /**
     * Run DTM receiver test using a range of channels
     *
     * @param {number} bitpattern to use
     * @param {number} length in bytes of transmit packets
     * @param {number} channelLow is the fist channel in
      the range to use for sweep transmission.
     * @param {number} channelHigh is the last channel in the range
      to use for sweep transmission.
     * @param {number} sweepTime is the time in milliseconds before
      moving on to the next channel in the sweep range.
     * @param {number} timeout of test in milliseconds. 0 disables timeout.
     * @param {boolean} randomPattern is true for random channel sweep
      pattern, false for sequential channel sweep.
     *
     * @returns {object} object containing success state and number of received packets
     */
    async sweepReceiverTest(
        bitpattern: number,
        length: number,
        channelLow: number,
        channelHigh: number,
        sweepTime = 1000,
        timeout = 0,
        randomPattern = false
    ): Promise<TestStatus> {
        this.#resetEvent();
        if (this.#isReceiving) {
            // Stop previous transmission
        }
        this.#isReceiving = false;
        const packetsReceivedForChannel = new Array(40).fill(0);
        this.#timeoutEvent = this.startTimeoutEvent(
            () => this.#isReceiving,
            timeout
        );
        let currentChannelIdx = 0;
        do {
            const frequency = channelToFrequency(
                channelLow + currentChannelIdx
            );
            this.#sweepTimedOut = false;
            this.#isReceiving = false;
            if (this.#timedOut) {
                // eslint-disable-next-line
                continue;
            }

            const cmd = DTMTransport.createReceiverCMD(
                frequency,
                length,
                bitpattern
            );
            const endEventDataReceivedEvt = this.endEventDataReceived();
            const responseEvent = this.#dtmTransport.sendCMD(cmd);

            if (this.#timedOut) {
                // eslint-disable-next-line
                continue;
            }
            const response = await responseEvent;
            this.#isReceiving = true;

            if (!reportSuccess(response)) {
                clearTimeout(this.#timeoutEvent);
                return {
                    type: 'error',
                    message: 'Could not start receiver.',
                };
            }

            const endEvent = this.#startedReceiverEvent(
                channelLow + currentChannelIdx
            );

            const sweepTimeoutEvent = this.startSweepTimeoutEvent(
                () => this.#isReceiving,
                sweepTime
            );
            this.#sweepTimedOut = false;
            if (this.#dbmPayloadtimedOut) {
                this.endCurrentTest();
            }

            const status = await endEventDataReceivedEvt;
            clearTimeout(sweepTimeoutEvent);

            packetsReceivedForChannel[channelLow + currentChannelIdx] +=
                status.received;

            endEvent(status.received);

            if (randomPattern) {
                currentChannelIdx = Math.ceil(
                    Math.random() * (channelHigh - channelLow)
                );
            } else {
                currentChannelIdx =
                    (currentChannelIdx + 1) % (channelHigh - channelLow + 1);
            }
        } while (this.#isReceiving && !this.#timedOut);

        clearTimeout(this.#timeoutEvent);
        return {
            type: 'receiver',
            receivedPerChannel: packetsReceivedForChannel,
        };
    }

    /**
     * End any running DTM test
     *
     * @returns {null} nothing is returned
     */
    async endTest() {
        if (this.#timedOut) {
            return;
        }
        this.#timedOut = true;
        clearTimeout(this.#timeoutEvent);

        if (
            !this.#sweepTimedOut &&
            (this.#isTransmitting || this.#isReceiving)
        ) {
            await this.endCurrentTest();
        }
    }

    async dispose() {
        this.#eventEmiter.removeAllListeners();
        await this.endTest().catch(() => {});
        await this.#dtmTransport.dispose();
        logger.debug('DTM: disposed');
    }
}
