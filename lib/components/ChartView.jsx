import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { defaults, Line } from 'react-chartjs-2';

import { logger } from 'nrfconnect/core';
import * as TestActions from '../actions/testActions';

const chartData = (current, history, activations) => {

    const datasets = [];
    if (current !== undefined) {
        datasets.push({
          label: 'Current active channel',
          data: current,
          backgroundColor: [
              'rgba(102, 255, 255, 0.5)',
                //'rgba(255, 99, 132, 0.2)',
                //'rgba(54, 162, 235, 0.2)',
                //'rgba(255, 206, 86, 0.2)',
                //'rgba(75, 192, 192, 0.2)',
                //'rgba(153, 102, 255, 0.2)',
                //'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(102, 255, 255, 1)',
            ],
            borderWidth: 1
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

    const channelLabels = Array.from(Array(40), (_,x) => x);
    return {
    labels: channelLabels,
    datasets: datasets,
    }
}

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
  legendTemplate: '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
}

let receiveValueHistory = new Array(40).fill(0);
let receiveValueHistoryTicks = new Array(40).fill(0);

const ChartView = ({
    selectedTestMode,
    currentChannel,
    lastChannel,
    lastReceived,
    testingState,
}) => {

    receiveValueHistory = [...receiveValueHistory];
    const activationColors = new Array(40).fill("#000000");
    receiveValueHistoryTicks.forEach((value, idx) => {
        if (value > 60) {
            receiveValueHistory[idx] = 0;
        }
        if (value < 10) {
            activationColors[idx] = "#90ef00"
        }
        else if (value < 25) {
            activationColors[idx] = "#be3000"
        }
        else {
            activationColors[idx] = "#ef3000"
            }
        receiveValueHistoryTicks[idx] += 1;
    });


    //receiveValueHistoryTicks = nextReceiveValueHistoryTicks;
    if (lastChannel.channel !== undefined) {
        receiveValueHistory[lastChannel.channel] = lastChannel.received;
        receiveValueHistoryTicks[lastChannel.channel] = 0;
    }


    let currentChannelData = new Array(40).fill(0);
    if (currentChannel !== undefined) {
        currentChannelData[currentChannel] = Math.max(1, Math.max(...receiveValueHistory));
    }

    let receivedChannelData = new Array(40).fill(0);
    if (lastChannel.channel !== undefined) {
        receivedChannelData[lastChannel.channel] = lastChannel.received;
    }

    if (testingState === TestActions.TEST_STATES.idle) {
        return (
        <Line data={chartData(undefined, lastReceived, new Array(40).fill("#000000"))}
              options={options}
              width="600" height="250"/>
          );
    } else {
        return (
        <Line data={chartData(currentChannelData, receiveValueHistory, activationColors)}
              options={options}
              width="600" height="250"/>
          );
    }





}

ChartView.propTypes = {
    selectedTestMode: PropTypes.number.isRequired,
    channelHistory: PropTypes.array.isRequired,
    lastChannel: PropTypes.object.isRequired,
    lastReceived: PropTypes.array.isRequired,
};
export default ChartView;
