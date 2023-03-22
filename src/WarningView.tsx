/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Alert,
    Button,
    getReadbackProtection,
    selectedDevice,
} from 'pc-nrfconnect-shared';

import {
    getCommunicationError,
    getCompatibleDeviceWarning,
} from './reducers/warningReducer';
import { recoverHex } from './utils/recoverHex';

const WarningView = () => {
    const compatibleDeviceWarning = useSelector(getCompatibleDeviceWarning);
    const communicationError = useSelector(getCommunicationError);
    const readbackProtection = useSelector(getReadbackProtection);
    const dispatch = useDispatch();

    const device = useSelector(selectedDevice);

    return (
        <>
            {compatibleDeviceWarning && (
                <Alert variant="warning" label="">
                    {compatibleDeviceWarning}
                </Alert>
            )}
            {communicationError && (
                <>
                    <Alert variant="danger" label="">
                        <div className="d-flex justify-content-between">
                            {communicationError}
                        </div>
                    </Alert>
                    {device && readbackProtection === 'protected' && (
                        <Alert variant="warning" label="">
                            <div className="d-flex align-items-center">
                                Unable to verify compatible firmware because the
                                selected device has readback protection enabled.
                                <Button
                                    onClick={() => recoverHex(device, dispatch)}
                                    variant="secondary"
                                    className="alert-program"
                                >
                                    Program compatible firmware
                                </Button>
                            </div>
                        </Alert>
                    )}
                </>
            )}
        </>
    );
};

export default WarningView;
