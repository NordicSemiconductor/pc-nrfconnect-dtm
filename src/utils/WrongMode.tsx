/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useSelector } from 'react-redux';

import { getMode } from '../reducers/testReducer';

import styles from './wrongMode.module.scss';

export default () => {
    const currentMode = useSelector(getMode);
    return (
        <div className={styles.wrongModeContainer}>
            <div>
                Currently the device is running in {currentMode} mode. Switch to
                the <span className={styles.tabName}>{currentMode}</span> tab to
                see the results.
            </div>
        </div>
    );
};
