/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { bleChannels } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { getReceivedTxPower } from '../reducers/settingsReducer';
import {
    getCurrentChannel,
    getIsInReceiverMode,
    getIsRunning,
} from '../reducers/testReducer';
import chartColors from '../utils/chartColors';
import dbmValues from '../utils/dbmValues';
import WrongMode from '../utils/WrongMode';

const FREQUENCY_BASE = 2402;
const FREQUENCY_INTERVAL = 2;

const chartDataTransmit = (
    currentChannel: number | undefined,
    txPower: number
) => {
    const active = Array.from(Array(bleChannels.length), () => 0);
    if (currentChannel !== undefined) {
        active[currentChannel] = dbmValues.indexOf(txPower) + 1;
    }

    const bleChannelsUpdated = bleChannels.map(
        (channel, index) =>
            `${channel} | ${FREQUENCY_BASE + index * FREQUENCY_INTERVAL} MHz`
    );

    const datasets = [
        {
            label: 'Active transmission power',
            data: active,
            backgroundColor: chartColors.bar,
            borderColor: chartColors.bar,
            borderWidth: 1,
            hoverBackgroundColor: chartColors.bar,
            hoverBorderColor: chartColors.bar,
            datalabels: { display: false },
        },
        {
            label: 'bgBars',
            backgroundColor: chartColors.background,
            borderWidth: 0,
            data: Array(bleChannelsUpdated.length).fill(active.length),
            display: false,
            datalabels: { display: false },
        },
    ];

    return {
        labels: bleChannelsUpdated,
        datasets,
    };
};

const TransmitterChartView = () => {
    const currentChannel = useSelector(getCurrentChannel);
    const isRunning = useSelector(getIsRunning);
    const isInReceiverMode = useSelector(getIsInReceiverMode);
    const txPower = useSelector(getReceivedTxPower);
    const dBmValues = [-1, dbmValues];

    if (isInReceiverMode) {
        return <WrongMode />;
    }

    return (
        <Bar
            data={chartDataTransmit(
                isRunning ? currentChannel : undefined,
                txPower
            )}
            options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    tooltip: {
                        enabled: false,
                    },
                    legend: { display: false },
                },
                animation: false,
                scales: {
                    y: {
                        min: 0,
                        max: dBmValues.length - 1,
                        suggestedMin: undefined,
                        suggestedMax: undefined,
                        ticks: {
                            display: true,
                            stepSize: 1,
                            callback: dBmIndex =>
                                dBmIndex in dBmValues && dBmIndex !== 0
                                    ? dBmValues[
                                          Number.parseInt(
                                              dBmIndex.toString(),
                                              10
                                          )
                                      ]
                                    : '',
                            color: chartColors.label,
                        },
                        title: {
                            display: true,
                            text: 'Strength (dBm)',
                            color: chartColors.label,
                            font: { size: 14 },
                        },
                        grid: {
                            display: false,
                        },
                        border: {
                            display: false,
                        },
                    },

                    xAxesTop: {
                        type: 'category',
                        position: 'top',
                        offset: true,
                        stacked: true,
                        grid: {
                            display: false,
                        },
                        border: {
                            display: false,
                        },
                        ticks: {
                            callback: (_: unknown, index: number) =>
                                String(bleChannels[index]).padStart(2, '0'),
                            minRotation: 0,
                            maxRotation: 0,
                            labelOffset: 0,
                            autoSkipPadding: 5,
                            color: chartColors.label,
                        },
                        title: {
                            display: true,
                            text: 'Bluetooth LE channel',
                            color: chartColors.label,
                            font: { size: 14 },
                        },
                    },
                    x: {
                        type: 'category',
                        position: 'bottom',
                        offset: true,
                        stacked: true,
                        grid: {
                            offset: true,
                            display: false,
                        },
                        border: {
                            display: false,
                        },
                        ticks: {
                            callback: (_, index) =>
                                FREQUENCY_BASE + index * FREQUENCY_INTERVAL,
                            minRotation: 90,
                            labelOffset: 0,
                            autoSkipPadding: 5,
                            color: chartColors.label,
                        },
                        title: {
                            display: true,
                            text: 'MHz',
                            color: chartColors.label,
                            font: { size: 14 },
                            padding: { top: 10 },
                        },
                    },
                },
            }}
        />
    );
};

export default TransmitterChartView;
