/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

// eslint-disable-next-line import/no-unresolved
import React from 'react';
import Alert from 'react-bootstrap/Alert';
import { useSelector } from 'react-redux';

import {
    getCommunicationError,
    getCompatibleDeviceWaring,
} from './reducers/warningReducer';

const warningIcon = <span className="mdi mdi-sign warning-sign" />;

const combineWarnings = (warnings: string[]) =>
    warnings
        .filter(str => str.length !== 0)
        .map((s, index) => (
            <Alert variant="danger" key={`warning-${index + 1}`}>
                <span>{warningIcon}</span>
                {s}
            </Alert>
        ));

const WarningView = () => {
    const compatibleDeviceWarning = useSelector(getCompatibleDeviceWaring);
    const communicationError = useSelector(getCommunicationError);
    return (
        <div className="warning-view">
            {combineWarnings([compatibleDeviceWarning, communicationError])}
        </div>
    );
};

export default WarningView;
