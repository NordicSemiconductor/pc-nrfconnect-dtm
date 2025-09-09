/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { validate0x09Command } from '../dtm/DTM';
import { toTwosComplementBitString } from '../dtm/DTM_transport';

describe('TX power values', () => {
    const values = [
        [-40, '11011000'],
        [-25, '11100111'],
        [-16, '11110000'],
        [-1, '11111111'],
        [0, '00000000'],
        [1, '00000001'],
        [5, '00000101'],
        [8, '00001000'],
    ] as [number, string][];
    it('should be converted to twos complement string', () => {
        values.forEach(([value, expected]) => {
            expect(toTwosComplementBitString(value)).toEqual(expected);
        });
    });
});

describe('TX power return events', () => {
    const valuesEv = [
        [[0x00, 0x01], false],
        [[0x01, 0x7f], false],
        [[0x00, 0x00], true],
        [[0x01, 0xaa], true],
    ] as [number[], boolean][];
    const mock = jest.fn(validate0x09Command);
    it('should be evaluated correctly', () => {
        valuesEv.forEach(([value, shouldSucceed]) => {
            try {
                mock(value);
            } catch (e) {
                // Ignore the error, we just want to check if it was thrown
            }
            if (shouldSucceed) {
                expect(mock).toHaveReturned();
            } else {
                expect(mock).toThrow();
            }
        });
    });

    const valuesInt = [
        [[0x00, 0x00], 0],
        [[0x00, 0x02], 1],
        [[0x01, 0x02], -127],
        [[0x01, 0xfe], -1],
    ] as [number[], number][];
    it('should be converted into correct integer values', () => {
        valuesInt.forEach(([value, expected]) => {
            expect(validate0x09Command(value)).toEqual(expected);
        });
    });
});
