/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import {
    describeError,
    logger,
} from '@nordicsemiconductor/pc-nrfconnect-shared';
import { SerialPort } from 'serialport';

import { DtmPacketType } from './types';

// 2 bits
const DTM_CMD = {
    TEST_SETUP: '00',
    RECEIVER_TEST: '01',
    TRANSMITTER_TEST: '10',
    TEST_END: '11',
};

// 6 bits
const DTM_CONTROL = {
    // Test setup cmd
    RESET: 0x00,
    ENABLE_LENGTH: 0x01,
    PHY: 0x02,
    MODULATION: 0x03,
    FEATURES: 0x04,
    TXRX: 0x05,

    // Test end cmd
    END: 0x00,
};

// 6 bits
const DTM_FREQUENCY = (f: number) =>
    ((f - 2402) / 2).toString(2).padStart(6, '0');

const DTM_PARAMETER = {
    DEFAULT: 0x00,
    PHY_LE_1M: 0x01,
    PHY_LE_2M: 0x02,
    PHY_LE_CODED_S8: 0x03,
    PHY_LE_CODED_S2: 0x04,

    STANDARD_MODULATION_INDEX: 0x00,
    STABLE_MODULATION_INDEX: 0x01,

    SUPPORTED_MAX_TX_OCTETS: 0x00,
    SUPPORTED_MAX_TX_TIME: 0x01,
    SUPPORTED_MAX_RX_OCTETS: 0x02,
    SUPPORTED_MAX_RX_TIME: 0x03,
};

// 2 bits
const DTM_DC = {
    DEFAULT: '00',
};

// 2 bits
const DTM_EVENT = {
    LE_TEST_STATUS_EVENT: 0,
    LE_PACKET_REPORT_EVENT: 1,
};

const DTM_CMD_FORMAT = (cmd: string) => {
    const firstByte = parseInt(cmd.substring(0, 8), 2);
    const secondByte = parseInt(cmd.substring(8, 16), 2);
    return Buffer.from([firstByte, secondByte]);
};

export const toTwosComplementBitString = (data: number) => {
    // 128 + (-x) = Math.abs(-128 + x)
    const absTwosComplemtentValue = (data < 0 ? 128 : 0) + data;
    const negativeBit = data < 0 ? 128 : 0;
    return (negativeBit + absTwosComplemtentValue).toString(2).padStart(8, '0');
};

const toBitString = (data: number, length = 6) =>
    data.toString(2).padStart(length, '0');

const cmdToHex = (cmd: Buffer) => {
    const cmdString = cmd.toString('hex').toUpperCase();
    return `0x${cmdString.substring(0, 2)} 0x${cmdString.substring(2, 4)}`;
};

class DTMTransport {
    #port: SerialPort;
    #dataBuffer?: Buffer;
    #callback?: (data: Buffer) => void;
    #sendQueue: {
        cmd: Buffer;
        resolve: (value: number[]) => void;
        reject: (error: Error) => void;
    }[] = [];
    #isProcessing = false;

    constructor(comName: string, baudRate: number) {
        DTMTransport.#debug('Created');
        this.#port = new SerialPort({
            path: comName,
            autoOpen: false,
            baudRate,
        });

        this.addListeners();
    }

    static #debug(message: string, ...meta: unknown[]) {
        logger.debug(`DTM Transport: ${message}`, meta);
    }

    static #error(message: string, ...meta: unknown[]) {
        logger.error(`DTM Transport: ${message}`, meta);
    }

    addListeners() {
        DTMTransport.#debug('addListeners');
        this.#port.on('data', (data: Buffer) => {
            if (this.#callback) {
                if (data.length === 1) {
                    if (this.#dataBuffer) {
                        this.#dataBuffer = Buffer.concat([
                            this.#dataBuffer,
                            data,
                        ]);
                        this.#callback(this.#dataBuffer);
                        this.#dataBuffer = undefined;
                    } else {
                        this.#dataBuffer = data;
                    }
                } else if (data.length === 2) {
                    this.#callback(data);
                } else {
                    logger.error('Unexpected data length: ', data.length);
                }
            } else {
                DTMTransport.#error('Unhandled data: ', data);
            }
        });

        this.#port.on('error', error => {
            DTMTransport.#debug(`error: ${describeError(error)}`);
        });
        this.#port.on('open', () => {
            DTMTransport.#debug('Port Opened');
        });
        this.#port.on('close', () => {
            DTMTransport.#debug('Port Closed');
        });
    }

    open() {
        return new Promise<void>((resolve, reject) => {
            this.#port.open(err => {
                if (err) {
                    DTMTransport.#debug(
                        `Failed to open serialport with error: ${err}`,
                    );
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    close() {
        DTMTransport.#debug('Closing serialport');
        return new Promise<void>((resolve, reject) => {
            this.#port.close(err => {
                if (err) {
                    DTMTransport.#debug(
                        `Failed to close serialport with error: ${describeError(
                            err,
                        )}`,
                    );
                    reject(err);
                    return;
                }
                DTMTransport.#debug('Succeeded to close serialport');
                resolve();
            });
        });
    }

    /**
     * Create command
     *
     * @param {string}cmdType the type of command from 1st to 2nd bit
     * @param {string}arg2 the parameter from 3nd to 8th bit
     * @param {string}arg3 the parameter from 9th to 14 bit
     * @param {string}arg4 the parameter from 15th to 16th bit
     *
     * @returns {DTM_CMD_FORMAT} formatted command
     */
    static #createCMD(cmdType: string, arg2: string, arg3: string, arg4 = '') {
        return DTM_CMD_FORMAT(cmdType + arg2 + arg3 + arg4);
    }

    /**
     * Create setup command
     *
     * @param {DTM_CONTROL} control the control to set
     * @param {DTM_PARAMETER} parameter the parameter to set
     * @param {DTM_DC} dc the dc to set
     *
     * @returns {createCMD} created command
     */
    static createSetupCMD(
        control = DTM_CONTROL.RESET,
        parameter = DTM_PARAMETER.DEFAULT,
        dc = DTM_DC.DEFAULT,
    ) {
        DTMTransport.#debug(`Create setup CMD with control: ${control}`);
        DTMTransport.#debug(`Create setup CMD with parameter: ${parameter}`);
        DTMTransport.#debug(`Create setup CMD with dc type: ${dc}`);
        const controlBits = toBitString(control);
        const parameterBits = toBitString(parameter);
        return DTMTransport.#createCMD(
            DTM_CMD.TEST_SETUP,
            controlBits,
            parameterBits,
            dc,
        );
    }

    static createEndCMD() {
        DTMTransport.#debug('Create test end CMD');
        return DTMTransport.#createCMD(
            DTM_CMD.TEST_END,
            toBitString(DTM_CONTROL.END),
            toBitString(DTM_PARAMETER.DEFAULT),
            DTM_DC.DEFAULT,
        );
    }

    /**
     * Create transmitter command
     *
     * @param {DTM_FREQUENCY} frequency the frequency to set
     * @param {DTM_LENGTH} length the length to set
     * @param {DTM_PKT} pkt the pkt to set
     *
     * @returns {createCMD} created command
     */
    static createTransmitterCMD(
        frequency = 2402,
        length = 0,
        pkt = DtmPacketType.PRBS9,
    ) {
        DTMTransport.#debug(
            `Create transmitter CMD with frequency: ${frequency}`,
        );
        DTMTransport.#debug(`Create transmitter CMD with length: ${length}`);
        DTMTransport.#debug(`Create transmitter CMD with packet type: ${pkt}`);

        const dtmFrequency = DTM_FREQUENCY(frequency);
        const dtmLength = toBitString(length);
        const dtmPkt = toBitString(pkt, 2);
        return DTMTransport.#createCMD(
            DTM_CMD.TRANSMITTER_TEST,
            dtmFrequency,
            dtmLength,
            dtmPkt,
        );
    }

    /**
     * Create receiver command
     *
     * @param {DTM_FREQUENCY} frequency the frequency to set
     * @param {DTM_LENGTH} length the length to set
     * @param {DTM_PKT} pkt the pkt to set
     *
     * @returns {createCMD} created command
     */
    static createReceiverCMD(
        frequency = 2402,
        length = 0,
        pkt = DtmPacketType.PRBS9,
    ) {
        DTMTransport.#debug(`Create receiver CMD with frequency: ${frequency}`);
        DTMTransport.#debug(`Create receiver CMD with length: ${length}`);
        DTMTransport.#debug(`Create receiver CMD with packet type: ${pkt}`);
        const dtmFrequency = DTM_FREQUENCY(frequency);
        const dtmLength = toBitString(length);
        const dtmPkt = toBitString(pkt, 2);
        return DTMTransport.#createCMD(
            DTM_CMD.RECEIVER_TEST,
            dtmFrequency,
            dtmLength,
            dtmPkt,
        );
    }

    static createTxPowerCMD(dbm: number) {
        DTMTransport.#debug(`Create tx power CMD: ${dbm}`);
        const dtmDbm = toTwosComplementBitString(dbm);

        return DTMTransport.#createCMD(
            DTM_CMD.TEST_SETUP,
            toBitString(9, 6),
            dtmDbm,
        );
    }

    static createSelectTimerCMD(value: number) {
        DTMTransport.#debug(`Create select timer CMD: ${value}`);
        const dtmTimer = toBitString(value);
        const dtmLength = toBitString(3);
        const dtmPkt = toBitString(DtmPacketType['Constant carrier'], 2);
        return DTMTransport.#createCMD(
            DTM_CMD.TRANSMITTER_TEST,
            dtmTimer,
            dtmLength,
            dtmPkt,
        );
    }

    #processQueue() {
        if (this.#isProcessing || this.#sendQueue.length === 0) {
            return;
        }

        this.#isProcessing = true;
        const queueItem = this.#sendQueue.shift();
        if (!queueItem) return;
        const { cmd, resolve, reject } = queueItem;

        DTMTransport.#debug(`Sending data: ${cmdToHex(cmd)}`);

        const responseTimeout = setTimeout(() => {
            this.#callback = undefined;
            this.#isProcessing = false;
            reject(new Error('Timeout'));
            // Process next command in queue
            this.#processQueue();
        }, 1000);

        this.#callback = data => {
            this.#callback = undefined;
            clearTimeout(responseTimeout);
            DTMTransport.#debug(`Receiving data: ${cmdToHex(data)}`);
            this.#isProcessing = false;
            resolve(Array.from(data));
            // Process next command in queue
            this.#processQueue();
        };

        this.#port.write(cmd);
    }

    async sendCMD(cmd: Buffer): Promise<number[]> {
        if (!this.#port.isOpen) {
            await this.open();
        }

        return new Promise<number[]>((resolve, reject) => {
            this.#sendQueue.push({ cmd, resolve, reject });
            this.#processQueue();
        });
    }

    async dispose() {
        this.#port.removeAllListeners();
        await this.close().catch(() => {});
        DTMTransport.#debug(`Disposed`);
    }
}

export {
    DTMTransport,
    DTM_CONTROL,
    DTM_DC,
    DTM_PARAMETER,
    DTM_FREQUENCY,
    DTM_EVENT,
};
