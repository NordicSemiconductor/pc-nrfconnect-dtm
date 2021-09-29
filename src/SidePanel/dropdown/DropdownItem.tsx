/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

interface DropdownItemProps {
    title: string;
    onSelect?: () => void;
}

const DropdownItem = ({ title, onSelect }: DropdownItemProps) => (
    <button type="button" className="dropdown-item" onClick={onSelect}>
        {title}
    </button>
);

export default DropdownItem;
