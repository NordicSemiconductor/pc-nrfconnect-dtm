/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Alert,
    getReadbackProtection,
    selectedDevice,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

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
                    {device &&
                        readbackProtection !==
                            'NRFDL_PROTECTION_STATUS_NONE' && (
                            <Alert variant="warning" label="">
                                <div className="d-flex align-items-center readback-protection-warning flex-wrap">
                                    Unable to verify compatible firmware because
                                    the selected device has readback protection
                                    enabled.
                                    <button
                                        onClick={() =>
                                            dispatch(recoverHex(device))
                                        }
                                        type="button"
                                    >
                                        Program compatible firmware
                                    </button>
                                </div>
                            </Alert>
                        )}
                </>
            )}
        </>
    );
};

export default WarningView;
