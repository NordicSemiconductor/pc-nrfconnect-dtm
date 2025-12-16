/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { Alert } from '@nordicsemiconductor/pc-nrfconnect-shared';

import { getCommunicationError } from './reducers/warningReducer';

const WarningView = () => {
    const communicationError = useSelector(getCommunicationError);

    if (!communicationError) return null;

    return (
        <Alert variant="danger" label="">
            <div className="d-flex justify-content-between">
                {communicationError}
            </div>
        </Alert>
    );
};

export default WarningView;
