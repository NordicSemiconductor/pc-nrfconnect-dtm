// eslint-disable-next-line import/no-unresolved
import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';

import * as TestActions from '../actions/testActions';

const chartData = (current, history, activations) => {
    const datasets = [];
    if (current !== undefined) {
        datasets.push({
            label: 'Current active channel',
            data: current,
            backgroundColor: [
                'rgba(102, 255, 255, 0.5)',
            ],
            borderColor: [
                'rgba(102, 255, 255, 1)',
            ],
            borderWidth: 1,
        });
    }

    if (history !== undefined) {
        datasets.push({
            label: 'Received packets',
            fillColor: 'rgba(220,220,220,0.2)',
            strokeColor: 'rgba(220,220,220,1)',
            pointColor: 'rgba(220,220,220,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(220,220,220,1)',
            data: history,
            pointBorderColor: activations,
            pointBackgroundColor: activations,
        });
    }

    const channelLabels = Array.from(Array(40), (_, x) => x);
    return {
        labels: channelLabels,
        datasets,
    };
};

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

let receiveValueHistory = new Array(40).fill(0);
const receiveValueHistoryTicks = new Array(40).fill(0);

const ChartView = ({
    currentChannel,
    lastChannel,
    lastReceived,
    testingState,
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
            <Line
                data={chartData(undefined, lastReceived, new Array(40).fill('#000000'))}
                options={options}
                width="600"
                height="250"
            />
        );
    }

    return (
        <Line
            data={chartData(currentChannelData, receiveValueHistory, activationColors)}
            options={options}
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
};
export default ChartView;
