/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import FormLabel from 'react-bootstrap/FormLabel';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dropdown,
    NumberInlineInput,
    Slider,
} from '@nordicsemiconductor/pc-nrfconnect-shared';
import { DTM, DTM_PKT_STRING } from 'nrf-dtm-js/src/DTM';

import {
    bitpatternChanged,
    getBitpattern,
    getLength,
    lengthChanged,
} from '../reducers/settingsReducer';
import { getIsRunning } from '../reducers/testReducer';

const VENDOR_PAYLOAD_LENGTH = 1;

interface PacketTypeViewProps {
    bitpatternUpdated: (pkgType: number) => void;
    lengthUpdated: (newLength: number) => void;
    selectedPkgType: number;
    isRunning: boolean;
    isVendorPayload: (pkgType: number) => boolean;
}

const PacketTypeView = ({
    bitpatternUpdated,
    lengthUpdated,
    selectedPkgType,
    isRunning,
    isVendorPayload,
}: PacketTypeViewProps) => {
    const items = Object.entries(DTM.DTM_PKT)
        .filter(([key]) => key !== 'DEFAULT')
        .map(([key, pkgType]: [string, unknown]) => ({
            label: DTM_PKT_STRING[pkgType as number],
            value: key,
        }));

    return (
        <Dropdown
            label="Packet type"
            items={items}
            selectedItem={
                items.find(e => DTM.DTM_PKT[e.value] === selectedPkgType) ??
                items[0]
            }
            onSelect={item => {
                bitpatternUpdated(DTM.DTM_PKT[item.value]);
                if (isVendorPayload(DTM.DTM_PKT[item.value])) {
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
}: PacketLengthView) => {
    const range = { min: 1, max: 255 };
    return (
        <div className="slider-container">
            <FormLabel htmlFor="packet-length-slider">
                Packet length
                <NumberInlineInput
                    value={currentLength}
                    range={range}
                    disabled={isRunning}
                    onChange={value =>
                        changedFunc(isRunning ? currentLength : value)
                    }
                />{' '}
                Bytes
            </FormLabel>
            <Slider
                id="packet-length-slider"
                values={[currentLength]}
                disabled={isRunning}
                onChange={[
                    value => changedFunc(isRunning ? currentLength : value),
                ]}
                range={range}
            />
        </div>
    );
};

const PacketView = () => {
    const pkgType = useSelector(getBitpattern);
    const packetLength = useSelector(getLength);
    const isRunning = useSelector(getIsRunning);

    const dispatch = useDispatch();

    const lengthChangedAction = (value: number) =>
        dispatch(lengthChanged(value));
    const isVendorPayload = (type: number) =>
        DTM_PKT_STRING[type] === DTM_PKT_STRING[DTM.DTM_PKT.PAYLOAD_VENDOR];

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
