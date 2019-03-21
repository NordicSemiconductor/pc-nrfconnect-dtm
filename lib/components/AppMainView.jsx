/* Copyright (c) 2015 - 2018, Nordic Semiconductor ASA
 *
 * All rights reserved.
 *
 * Use in source and binary forms, redistribution in binary form only, with
 * or without modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions in binary form, except as embedded into a Nordic
 *    Semiconductor ASA integrated circuit in a product or a software update for
 *    such product, must reproduce the above copyright notice, this list of
 *    conditions and the following disclaimer in the documentation and/or other
 *    materials provided with the distribution.
 *
 * 2. Neither the name of Nordic Semiconductor ASA nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * 3. This software, with or without modification, must only be used with a Nordic
 *    Semiconductor ASA integrated circuit.
 *
 * 4. Any software provided in binary form under this license must not be reverse
 *    engineered, decompiled, modified and/or disassembled.
 *
 * THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import React from 'react';
import { Button, FormGroup, ControlLabel, FormControl, InputGroup, Dropdown, SplitButton } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { logger } from 'nrfconnect/core';
import { DTM_FREQUENCY, DTM_PKT } from 'nrf-dtm-js';

class AppMainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            length: 0,
            bitPattern: DTM_PKT.PAYLOAD_PRBS9,

            useSingleChannel: true,
            singleChannelNum: 0,
            multiChannelLowNum: 0,
            multiChannelHighNum: 39,
            multiChannelMidNum: 19,

        };
    }

    onSingleChannelChange(event) {
        this.setState({ singleChannelNum: event.target.value });
    };
    onLengthChange(event) {
        this.setState({ length: event.target.value });
    };
    onPayloadModelChanged(event){
        this.setState({ bitPattern: event.target.value });
    }

    render() {
        console.log(this.props);
        const { dtm } = this.props;
        const testSetup = async () => {
            logger.info('Test setup');
            let response  = await dtm.setupReset();
            logger.info('Response: ', response);
            response  = await dtm.setupLength(this.state.length);
            logger.info('Response: ', response);
            /*const cmd = dtm.createSetupCMD();
            logger.info('Command: ', Buffer(cmd));
            const response = await dtm.sendCMD(cmd);
            logger.info('Response: ', response);*/
        };

        const testEnd = async () => {
            logger.info('Test end');
            const response = dtm.endTest();
            /*const cmd = dtm.createEndCMD();
            logger.info('Command: ', Buffer(cmd));
            const response = await dtm.sendCMD(cmd);
            logger.info('Response: ', response);
            const count = response.readUIntBE(0, 2) - Buffer.from([0x80, 0x00]).readUIntBE(0, 2)
            console.log(count);
            logger.info(`Packet count: ${count}`);*/
        };

        const transmitterTest = async () => {
            logger.info('Transmitter test');
            const response  = dtm.transmitterTest(
                parseInt(this.state.bitPattern, 10),
                parseInt(this.state.length, 10),
                {useSingleChannel: this.state.useSingleChannel,
                singleChannelNum: parseInt(this.state.singleChannelNum, 10),
                multiChannelLowNum: parseInt(this.state.multiChannelLowNum, 10),
                multiChannelHighNum: parseInt(this.state.multiChannelHighNum, 10),
                multiChannelMidNum: parseInt(this.state.multiChannelMidNum, 10)}
            );
            logger.info('Response: ', response);
            /*const cmd = dtm.createTransmitterCMD(DTM_FREQUENCY(this.state.frequency));
            logger.info('Command: ', Buffer(cmd));
            const response = await dtm.sendCMD(cmd);
            logger.info('Response: ', response);*/
        };

        const receiverTest = async () => {
            /*logger.info('Recever test');
            const cmd = dtm.createReceiverCMD(DTM_FREQUENCY(this.state.frequency));
            logger.info('Command: ', Buffer(cmd));
            const response = await dtm.sendCMD(cmd);
            logger.info('Response: ', response);*/
        };


        return (
            <div className="app-main-view">
                <Button
                    onClick = { testSetup }
                >
                    Test setup
                </Button>
                <Button
                    onClick = { testEnd }
                >
                    Test end
                </Button>

                <FormGroup>
                    <ControlLabel>Channel (0 - 39):</ControlLabel>
                    <InputGroup>
                        <FormControl value={ this.state.singleChannelNum } onChange={ this.onSingleChannelChange.bind(this) } />
                    </InputGroup>
                </FormGroup>

                <FormGroup>
                    <ControlLabel>Payload type:</ControlLabel>
                    <InputGroup>
                        <FormControl value={ this.state.bitPattern } onChange={ this.onPayloadModelChanged.bind(this) } />
                    </InputGroup>
                </FormGroup>

                <FormGroup>
                    <ControlLabel>Payload length:</ControlLabel>
                    <InputGroup>
                        <FormControl value={ this.state.length } onChange={ this.onLengthChange.bind(this) } />
                    </InputGroup>
                </FormGroup>


                <Button
                    onClick = { transmitterTest }
                >
                    Transmitter test
                </Button>
                <Button
                    onClick = { receiverTest }
                >
                    Receiver test
                </Button>

            </div>
        );
    }
};

AppMainView.propTypes = {
    dtm: PropTypes.object,
};

export default AppMainView;
