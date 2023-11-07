/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import {
    communicationError,
    incompatibleDevice,
} from '../reducers/warningReducer';

export const clearIncompatibleWarning = () => incompatibleDevice('');

export const clearCommunicationErrorWarning = () => communicationError('');
