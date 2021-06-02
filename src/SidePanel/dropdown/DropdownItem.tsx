import React from 'react';

interface DropdownItemProps {
    title: string;
    eventKey?: string;
    onSelect?: (eventKey: string) => void;
}

const DropdownItem = ({ title, eventKey, onSelect }: DropdownItemProps) => {
    const onClick = () => {
        return onSelect(eventKey);
    };

    return (
        <button type="button" className="dropdown-item" onClick={onClick}>
            {title}
        </button>
    );
};

export default DropdownItem;
