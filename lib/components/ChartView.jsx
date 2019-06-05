// eslint-disable-next-line import/no-unresolved
import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import * as TestActions from '../actions/testActions';
import { DTM_TEST_MODE_BUTTON } from '../actions/settingsActions';
import { dbmValues } from '../utils/constants';

const chartColors = {
    inactive: 'rgba(255,99,132,0.2)',
    active: 'rgba(110,205,172,0.5)',
};

const chartDataTransmit = (currentChannel, txPower) => {
    const active = Array.from(Array(40), () => 0);
    active[currentChannel] = txPower;

    const datasets = [];
    if (currentChannel !== undefined) {
        datasets.push({
            label: 'Active transmission power',
            data: active,
            backgroundColor: chartColors.active,
            borderColor: chartColors.active,
            borderWidth: 1,
            hoverBackgroundColor: chartColors.active,
            hoverBorderColor: chartColors.active,
        });
    }
    const channelLabels = Array.from(Array(40), (_, x) => x);
    return {
        labels: channelLabels,
        datasets,
    };
};

const chartDataReceive = history => {
    const datasets = [];
    if (history !== undefined) {
        datasets.push({
            label: 'Received packets',
            data: history,
            backgroundColor: chartColors.active,
            borderColor: chartColors.active,
            borderWidth: 1,
            hoverBackgroundColor: chartColors.active,
            hoverBorderColor: chartColors.active,
        });
    }

    const channelLabels = Array.from(Array(40), (_, x) => x);
    return {
        labels: channelLabels,
        datasets,
    };
};

const getOptions = selectedTestMode => {
    const options = {
        scaleShowGridLines: true,
        scaleGridLineColor: 'rgba(10,100,100,.05)',
        scaleGridLineWidth: 1,
        scaleShowHorizontalLines: true,
        scaleShowVerticalLines: true,
        bezierCurve: true,
        bezierCurveTension: 0.4,
        pointDot: true,
        pointDotRadius: 4,
        pointDotStrokeWidth: 1,
        pointHitDetectionRadius: 20,
        datasetStroke: true,
        datasetStrokeWidth: 2,
        datasetFill: true,
    };

    if (selectedTestMode === DTM_TEST_MODE_BUTTON.transmitter) {
        options.animation = false;
        options.scales = {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 13,
                    suggestedMin: undefined,
                    suggestedMax: undefined,
                    stepSize: 1,
                    callback: value => `${dbmValues[value]} dbm`,
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Strength (dbm)',
                },
            }],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Channel',
                },
            }],
        };
    } else {
        options.animation = null;
        options.scales = {
            yAxes: [{
                ticks: {
                    min: undefined,
                    max: undefined,
                    suggestedMin: 0,
                    suggestedMax: 10,
                    stepSize: undefined,
                    callback: value => value,
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Received packets',
                },
            }],

            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Channel',
                },
            }],
        };
    }
    return options;
};

let receiveValueHistory = new Array(40).fill(0);
const receiveValueHistoryTicks = new Array(40).fill(0);

const ChartView = ({
    selectedTestMode,
    currentChannel,
    lastChannel,
    lastReceived,
    testingState,
    txPower,
}) => {
    receiveValueHistory = [...receiveValueHistory];
    const activationColors = new Array(40).fill('#000000');
    receiveValueHistoryTicks.forEach((value, idx) => {
        if (value > 60) {
            receiveValueHistory[idx] = 0;
        }
        if (value < 10) {
            activationColors[idx] = '#90ef00';
        } else if (value < 25) {
            activationColors[idx] = '#be3000';
        } else {
            activationColors[idx] = '#ef3000';
        }
        receiveValueHistoryTicks[idx] += 1;
    });

    if (lastChannel.channel !== undefined) {
        receiveValueHistory[lastChannel.channel] = lastChannel.received;
        receiveValueHistoryTicks[lastChannel.channel] = 0;
    }


    const currentChannelData = new Array(40).fill(0);
    if (currentChannel !== undefined) {
        currentChannelData[currentChannel] = Math.max(1, Math.max(...receiveValueHistory));
    }

    const receivedChannelData = new Array(40).fill(0);
    if (lastChannel.channel !== undefined) {
        receivedChannelData[lastChannel.channel] = lastChannel.received;
    }

    if (testingState === TestActions.TEST_STATES.idle) {
        return (
            <Bar
                data={(selectedTestMode === DTM_TEST_MODE_BUTTON.transmitter &&
                    chartDataTransmit(undefined, txPower)) ||
                (selectedTestMode === DTM_TEST_MODE_BUTTON.receiver &&
                    chartDataReceive(lastReceived))}
                options={getOptions(selectedTestMode)}
                width="600"
                height="250"
            />
        );
    }

    return (
        <Bar
            data={(selectedTestMode === DTM_TEST_MODE_BUTTON.transmitter &&
                chartDataTransmit(currentChannel, txPower)) ||
                (selectedTestMode === DTM_TEST_MODE_BUTTON.receiver &&
                    chartDataReceive(lastReceived))}
            options={getOptions(selectedTestMode)}
            width="600"
            height="250"
        />
    );
};

ChartView.propTypes = {
    lastChannel: PropTypes.objectOf(PropTypes.number).isRequired,
    lastReceived: PropTypes.arrayOf(PropTypes.number).isRequired,
    testingState: PropTypes.number.isRequired,
    currentChannel: PropTypes.number.isRequired,
    selectedTestMode: PropTypes.number.isRequired,
    txPower: PropTypes.number.isRequired,
};
export default ChartView;
