/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dropdown,
    NumberInput,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { DtmPacketType } from '../dtm/types';
import {
    bitpatternChanged,
    getBitpattern,
    getLength,
    lengthChanged,
} from '../reducers/settingsReducer';
import { getIsRunning } from '../reducers/testReducer';

const VENDOR_PAYLOAD_LENGTH = 1;

interface PacketTypeViewProps {
    bitpatternUpdated: (pkgType: DtmPacketType) => void;
    lengthUpdated: (newLength: number) => void;
    selectedPkgType: number;
    isRunning: boolean;
    isVendorPayload: (pkgType: DtmPacketType) => boolean;
}

const PacketTypeView = ({
    bitpatternUpdated,
    lengthUpdated,
    selectedPkgType,
    isRunning,
    isVendorPayload,
}: PacketTypeViewProps) => {
    const items = Object.entries(DtmPacketType)
        .filter(([, value]) => typeof value === 'number') // only string keys
        .map(([label, key]) => ({
            label: label.replaceAll('_', ''),
            value: key as DtmPacketType,
        }));

    return (
        <Dropdown
            label="Packet type"
            items={items}
            selectedItem={
                items.find(e => e.value === selectedPkgType) ?? items[0]
            }
            onSelect={item => {
                bitpatternUpdated(item.value);
                if (isVendorPayload(item.value)) {
                    lengthUpdated(VENDOR_PAYLOAD_LENGTH);
                }
            }}
            disabled={isRunning}
        />
    );
};

interface PacketLengthView {
    changedFunc: (newLength: number) => void;
    currentLength: number;
    isRunning: boolean;
}

const PacketLengthView = ({
    changedFunc,
    currentLength,
    isRunning,
}: PacketLengthView) => (
    <NumberInput
        showSlider
        minWidth
        label="Packet length"
        unit="Bytes"
        value={currentLength}
        range={{ min: 1, max: 255 }}
        disabled={isRunning}
        onChange={value => changedFunc(isRunning ? currentLength : value)}
    />
);

const PacketView = () => {
    const pkgType = useSelector(getBitpattern);
    const packetLength = useSelector(getLength);
    const isRunning = useSelector(getIsRunning);

    const dispatch = useDispatch();

    const lengthChangedAction = (value: number) =>
        dispatch(lengthChanged(value));
    const isVendorPayload = (type: DtmPacketType) =>
        type === DtmPacketType['Constant carrier'];

    return (
        <>
            <PacketTypeView
                bitpatternUpdated={value => dispatch(bitpatternChanged(value))}
                lengthUpdated={lengthChangedAction}
                selectedPkgType={pkgType}
                isRunning={isRunning}
                isVendorPayload={isVendorPayload}
            />
            {!isVendorPayload(pkgType) && (
                <PacketLengthView
                    currentLength={packetLength}
                    changedFunc={lengthChangedAction}
                    isRunning={isRunning}
                />
            )}
        </>
    );
};

export default PacketView;
