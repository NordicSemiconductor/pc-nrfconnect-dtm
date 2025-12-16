/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { communicationError } from '../reducers/warningReducer';

export const clearCommunicationErrorWarning = () => communicationError('');
