/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { FC, useRef } from 'react';
import FormLabel from 'react-bootstrap/FormLabel';

import chevron from './chevron.svg';
import useDetectClick from './useDetectClick';

import './Dropdown.scss';

interface DropdownProps {
    title: string;
    id?: string;
    disabled?: boolean;
    label?: string;
}

const Dropdown: FC<DropdownProps> = ({
    title,
    id,
    disabled,
    label,
    children,
}) => {
    const dropdownRef = useRef(null);
    const [isActive, setIsActive] = useDetectClick(dropdownRef, false);
    const onClick = () => setIsActive(!isActive);

    return (
        <>
            <div className="dropdown-container">
                <FormLabel className="dropdown-label">{label}</FormLabel>
                <button
                    type="button"
                    className={`dropdown-btn dropdown-btn-${
                        isActive ? 'active' : 'inactive'
                    }`}
                    id={id}
                    onClick={onClick}
                    disabled={disabled}
                >
                    <span>{title}</span>
                    <img src={chevron} alt="" />
                </button>
                <div
                    ref={dropdownRef}
                    className={`dropdown-content dropdown-${
                        isActive ? 'active' : 'inactive'
                    }`}
                >
                    {children}
                </div>
            </div>
        </>
    );
};

export default Dropdown;
