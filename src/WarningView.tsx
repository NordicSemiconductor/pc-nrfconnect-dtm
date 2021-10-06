/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { Alert } from 'pc-nrfconnect-shared';

import {
    getCommunicationError,
    getCompatibleDeviceWarning,
} from './reducers/warningReducer';

const WarningView = () => {
    const compatibleDeviceWarning = useSelector(getCompatibleDeviceWarning);
    const communicationError = useSelector(getCommunicationError);

    return (
        <>
            {compatibleDeviceWarning && (
                <Alert variant="warning" label="">
                    {compatibleDeviceWarning}
                </Alert>
            )}
            {communicationError && (
                <Alert variant="danger" label="">
                    {communicationError}
                </Alert>
            )}
        </>
    );
};

export default WarningView;
