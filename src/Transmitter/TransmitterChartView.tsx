/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { bleChannels } from 'pc-nrfconnect-shared';

import { getBoard } from '../reducers/deviceReducer';
import { getTxPower } from '../reducers/settingsReducer';
import { getCurrentChannel, getIsRunning } from '../reducers/testReducer';
import { fromPCA } from '../utils/boards';
import chartColors from '../utils/chartColors';

const FREQUENCY_BASE = 2402;
const FREQUENCY_INTERVAL = 2;

const chartDataTransmit = (
    currentChannel: number | undefined,
    txPower: number
) => {
    const active = Array.from(Array(bleChannels.length), () => 0);
    if (currentChannel !== undefined) {
        active[currentChannel] = txPower;
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
    const txPower = useSelector(getTxPower);
    const boardType = useSelector(getBoard);
    const dBmValues = fromPCA(boardType).txPower;

    return (
        <Bar
            data={chartDataTransmit(
                isRunning ? currentChannel : undefined,
                txPower
            )}
            options={{
                maintainAspectRatio: false,
                responsive: true,
                legend: { display: false },
                animation: undefined,
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                display: true,
                                min: 0,
                                max: dBmValues.length - 1,
                                suggestedMin: undefined,
                                suggestedMax: undefined,
                                stepSize: 1,
                                callback: (value: number) =>
                                    value in dBmValues ? dBmValues[value] : '',
                                fontColor: chartColors.label,
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Strength (dBm)',
                                fontColor: chartColors.label,
                                fontSize: 14,
                            },
                            gridLines: {
                                display: false,
                                drawBorder: false,
                            },
                        },
                    ],
                    xAxes: [
                        {
                            type: 'category',
                            position: 'top',
                            offset: true,
                            stacked: true,
                            gridLines: {
                                display: false,
                            },
                            ticks: {
                                callback: (_: unknown, index: number) =>
                                    String(bleChannels[index]).padStart(2, '0'),
                                minRotation: 0,
                                maxRotation: 0,
                                labelOffset: 0,
                                autoSkipPadding: 5,
                                fontColor: chartColors.label,
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'BLE channel',
                                fontColor: chartColors.label,
                                fontSize: 14,
                            },
                        },
                        {
                            type: 'category',
                            position: 'bottom',
                            offset: true,
                            stacked: true,
                            gridLines: {
                                offsetGridLines: true,
                                display: false,
                                drawBorder: false,
                            },
                            ticks: {
                                callback: (_: unknown, index: number) =>
                                    FREQUENCY_BASE + index * FREQUENCY_INTERVAL,
                                minRotation: 90,
                                labelOffset: 0,
                                autoSkipPadding: 5,
                                fontColor: chartColors.label,
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'MHz',
                                fontColor: chartColors.label,
                                fontSize: 14,
                                padding: { top: 10 },
                            },
                        },
                    ],
                },
                tooltips: {
                    enabled: false,
                },
            }}
        />
    );
};

export default TransmitterChartView;
