/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import {
    communicationError,
    incompatibleDevice,
} from '../reducers/warningReducer';

export function clearIncompatibleWarning() {
    return incompatibleDevice('');
}

export function clearCommunicationErrorWarning() {
    return communicationError('');
}
