/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */
import { DTM } from 'nrf-dtm-js/src/DTM';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dtm: any;

export const getDTM = () => dtm;

let lastPort: string | undefined;
let lastBaudRate: number | undefined;

export const disposeDTM = async () => {
    if (!dtm) {
        return;
    }

    if (dtm?.dtmTransport.port.isOpen) {
        await dtm.dtmTransport.close();
        dtm = null;
    }
};

export const updateDTM = async ({
    port,
    baudRate,
}: {
    port?: string;
    baudRate?: number;
}) => {
    port ??= lastPort;
    baudRate ??= lastBaudRate;
    console.log(port, baudRate, lastPort, lastBaudRate);
    if (!dtm || port !== lastPort || baudRate !== lastBaudRate) {
        lastPort = port;
        lastBaudRate = baudRate;
        await disposeDTM();
        dtm = new DTM(port, baudRate);
        console.log('new DTM');
    }
    return dtm;
};
