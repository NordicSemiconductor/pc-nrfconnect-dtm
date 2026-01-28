/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    NumberInput,
    Overlay,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { getTxPower, txPowerChanged } from '../reducers/settingsReducer';
import { getIsRunning } from '../reducers/testReducer';
import dbmValues from '../utils/dbmValues';

const TxPowerView = () => {
    const txPower = useSelector(getTxPower);
    const isRunning = useSelector(getIsRunning);
    const dispatch = useDispatch();

    return (
        <NumberInput
            showSlider
            minWidth
            unit="dBm"
            label={
                <Overlay
                    tooltipId="tx-power-tooltip"
                    tooltipChildren={
                        <div className="tw-preflight tw-flex tw-flex-col tw-gap-4 tw-bg-gray-900 tw-px-4 tw-py-2 tw-text-left tw-text-gray-100">
                            <p>
                                Value of the SoC transmitter output power level,
                                set by the 0x09 DTM command.
                            </p>
                            <p>
                                When the selected output power level is not
                                supported, the DTM command sets a power level
                                that is nearest to the requested one, as per the
                                Bluetooth®️ specification.
                            </p>
                        </div>
                    }
                >
                    Transmit power{' '}
                    <span className="mdi mdi-help-circle-outline tw-px-1" />
                </Overlay>
            }
            value={txPower}
            range={{
                min: dbmValues.min,
                max: dbmValues.max,
                step: 1,
            }}
            disabled={isRunning}
            onChange={value => {
                dispatch(txPowerChanged(value));
            }}
            onChangeComplete={value => {
                dispatch(txPowerChanged(value));
            }}
        />
    );
};

export default TxPowerView;
