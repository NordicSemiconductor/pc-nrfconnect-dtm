/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { bleChannels } from 'pc-nrfconnect-shared';

import { getIsRunning, getLastReceived } from '../reducers/testReducer';
import chartColors from '../utils/chartColors';

Chart.plugins.register(ChartDataLabels);

const FREQUENCY_BASE = 2402;
const FREQUENCY_INTERVAL = 2;

const bleChannelsUpdated = bleChannels.map(
    (channel, index) =>
        `${channel} | ${FREQUENCY_BASE + index * FREQUENCY_INTERVAL} MHz`
);

const ChartView = () => {
    const lastReceived = useSelector(getLastReceived);
    const isRunning = useSelector(getIsRunning);
    const [maxY, setMaxY] = useState(0);

    useEffect(() => {
        if (isRunning) setMaxY(10);
    }, [isRunning]);

    return (
        <Bar
            data={{
                labels: bleChannelsUpdated,
                datasets: [
                    {
                        label: 'Received packets',
                        data: [...lastReceived],
                        backgroundColor: chartColors.bar,
                        borderColor: chartColors.bar,
                        borderWidth: 1,
                        hoverBackgroundColor: chartColors.bar,
                        hoverBorderColor: chartColors.bar,
                        datalabels: {
                            color: chartColors.bar,
                            anchor: 'end',
                            align: 'end',
                            formatter: (v: number) => (v <= 0 ? '' : v),
                            offset: -3,
                            font: { size: 9 },
                        },
                    },
                    {
                        label: 'bgBars',
                        backgroundColor: chartColors.background,
                        borderWidth: 0,
                        data: Array(bleChannelsUpdated.length).fill(maxY),
                        datalabels: { display: false },
                    },
                ],
            }}
            options={{
                maintainAspectRatio: false,
                legend: { display: false },
                tooltips: { enabled: false },
                animation: undefined,
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                min: undefined,
                                max: undefined,
                                suggestedMin: 0,
                                suggestedMax: 10,
                                stepSize: undefined,
                                callback: (
                                    value: number,
                                    _: unknown,
                                    values: number[]
                                ) => {
                                    setMaxY(values[0]);
                                    return value;
                                },
                                fontColor: chartColors.label,
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Received packets',
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
            }}
            width={600}
            height={250}
        />
    );
};

export default ChartView;
