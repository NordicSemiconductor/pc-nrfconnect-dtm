import React, { useRef } from 'react';

import chevron from './chevron.svg';
import useDetectClick from './useDetectClick';

import './Dropdown.scss';

interface DropdownProps {
    title: string;
    items?: JSX.Element[];
    id?: string;
    disabled?: boolean;
}

const Dropdown = ({ title, items, id, disabled }: DropdownProps) => {
    const dropdownRef = useRef(null);
    const [isActive, setIsActive] = useDetectClick(dropdownRef, false);
    const onClick = () => setIsActive(!isActive);

    return (
        <div className="dropdown-container">
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
                className={`dropdown dropdown-${
                    isActive ? 'active' : 'inactive'
                }`}
            >
                {items.map(item => item)}
            </div>
        </div>
    );
};

export default Dropdown;
