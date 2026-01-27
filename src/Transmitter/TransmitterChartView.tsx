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

const bottomChartOffset = 5;
const topChartOffset = 2;
const shiftValue = Math.abs(Math.min(...dbmValues)) + bottomChartOffset;

const chartDataTransmit = (
    currentChannel: number | undefined,
    txPower: number,
) => {
    const active = Array.from(Array(bleChannels.length), () => 0);
    if (currentChannel !== undefined) {
        active[currentChannel] = txPower + shiftValue;
    }

    const bleChannelsUpdated = bleChannels.map(
        (channel, index) =>
            `${channel} | ${FREQUENCY_BASE + index * FREQUENCY_INTERVAL} MHz`,
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
            datalabels: {
                color: chartColors.bar,
                anchor: 'end' as const,
                align: 'end' as const,
                formatter: (value: number) =>
                    value === 0 ? '' : value - shiftValue,
                offset: -3,
                font: { size: 9 },
            },
        },
        {
            label: 'bgBars',
            backgroundColor: chartColors.background,
            borderWidth: 0,
            data: Array(bleChannelsUpdated.length).fill(100),
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

    if (isInReceiverMode) {
        return <WrongMode />;
    }

    return (
        <Bar
            data={chartDataTransmit(
                isRunning ? currentChannel : undefined,
                txPower,
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
                        // Offset bottom and top to make sure bars and labels are fully visible
                        max:
                            shiftValue +
                            Math.max(...dbmValues) +
                            topChartOffset,
                        suggestedMin: undefined,
                        suggestedMax: undefined,
                        ticks: {
                            display: true,
                            stepSize: 1,
                            callback: dBmValue => {
                                const shiftedValue =
                                    Number(dBmValue) - shiftValue;

                                if (dBmValue === 0) return '';
                                // Show value for every 5 dBm and the maximum value
                                if (
                                    (Number(dBmValue) + bottomChartOffset) %
                                        5 ===
                                        0 ||
                                    shiftedValue === Math.max(...dbmValues)
                                )
                                    return shiftedValue;
                                return '';
                            },
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
