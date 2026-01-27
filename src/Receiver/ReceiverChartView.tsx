/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { bleChannels } from '@nordicsemiconductor/pc-nrfconnect-shared';
import { BarElement, CategoryScale, Chart, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {
    getIsInTransmitterMode,
    getIsRunning,
    getLastReceived,
} from '../reducers/testReducer';
import chartColors from '../utils/chartColors';
import WrongMode from '../utils/WrongMode';

Chart.register(ChartDataLabels, BarElement, CategoryScale, LinearScale);

const FREQUENCY_BASE = 2402;
const FREQUENCY_INTERVAL = 2;

const bleChannelsUpdated = bleChannels.map(
    (channel, index) =>
        `${channel} | ${FREQUENCY_BASE + index * FREQUENCY_INTERVAL} MHz`,
);

const ChartView = () => {
    const lastReceived = useSelector(getLastReceived);
    const isRunning = useSelector(getIsRunning);
    const isInTransmitterMode = useSelector(getIsInTransmitterMode);
    const [maxY, setMaxY] = useState(0);

    useEffect(() => {
        if (isRunning) setMaxY(0);
    }, [isRunning]);

    if (isInTransmitterMode) {
        return <WrongMode />;
    }

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
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                },
                animation: false,
                responsive: true,
                scales: {
                    y: {
                        min: 0,
                        suggestedMin: 0,
                        suggestedMax: 10,
                        ticks: {
                            // stepSize: undefined,
                            callback: (value, _, ticks) => {
                                setMaxY(ticks[ticks.length - 1].value);
                                return value;
                            },
                            color: chartColors.label,
                        },
                        title: {
                            display: true,
                            text: 'Received packets',
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

                    xAxisTop: {
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
                            callback: (_, index) =>
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
            width={600}
            height={250}
        />
    );
};

export default ChartView;
