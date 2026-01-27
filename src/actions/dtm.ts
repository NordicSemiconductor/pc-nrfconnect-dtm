/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import {
    type AppThunk,
    persistSerialPortOptions,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { DTM } from '../dtm/DTM';
import { getBaudRate, getSelectedSerialport } from '../reducers/deviceReducer';
import {
    endedChannel,
    resetChannel,
    startedChannel,
} from '../reducers/testReducer';
import { type RootState } from '../reducers/types';

let dtm: DTM | undefined;

let lastPort: string | null;
let lastBaudRate: number | null;

export const disposeDTM = async () => {
    await dtm?.dispose();
    dtm = undefined;
};

export const getDTM =
    (): AppThunk<RootState, Promise<DTM>> => async (dispatch, getState) => {
        const port = getSelectedSerialport(getState());
        const baudRate = getBaudRate(getState());
        if (!dtm || port !== lastPort || baudRate !== lastBaudRate) {
            lastPort = port;
            lastBaudRate = baudRate;
            await disposeDTM();
            if (!port) {
                throw new Error('Serial port is not set');
            }
            dtm = new DTM(port, baudRate);
            dtm.onReset(() => dispatch(resetChannel()));
            dtm.onStarted(event =>
                dispatch(dispatch(startedChannel(event.channel))),
            );
            dtm.onEnded(event =>
                dispatch(
                    endedChannel({
                        channel: event.channel,
                        received: event.packets,
                    }),
                ),
            );

            dispatch(persistSerialPortOptions({ path: port, baudRate }));
        }
        return dtm;
    };
