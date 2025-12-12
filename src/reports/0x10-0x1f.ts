// HEADS UP - THESE ARE INPUT REPORTS AND THEREFORE CONTAIN BUILDERS NOT PARSERS THNX
import type { ControllerStatus } from "../types.js";
type Signature<T = any> = (options: T, status: ControllerStatus) => [ number[], Partial<ControllerStatus> ];

/*
 * LIST OF REPORTS:
 * [x] 0x10 - Rumble
 * [x] 0x11 - Lights
 * [x] 0x12 - Data Reporting Mode
 * [ ] 0x13 - IR Camera Enable 1
 * [ ] 0x14 - Speaker Enable
 * [x] 0x15 - Status Information Request
 * [ ] 0x16 - Write Memory and Registers
 * [ ] 0x17 - Read Memory and Registers
 * [ ] 0x18 - Speaker Data
 * [ ] 0x19 - Speaker Mute
 * [ ] 0x1a - IR Camera Enable 2
 */

export const buildReport0x10 = ((option: { rumble: boolean }) => { // primarily controls rumble
    
    const report = [ 0x10, option.rumble ? 0x01 : 0x00 ];
    return [ report, { rumble: option.rumble } ];

}) satisfies Signature

export const buildReport0x11 = ((option: { lights: number }, status) => {

    const l1 = (option.lights & 0b1000) > 0 ? 0x10 : 0;
    const l2 = (option.lights & 0b0100) > 0 ? 0x20 : 0;
    const l3 = (option.lights & 0b0010) > 0 ? 0x40 : 0;
    const l4 = (option.lights & 0b0001) > 0 ? 0x80 : 0;
    const vibe = status.rumble ? 0x01 : 0x00;

    const LL = l1 | l2 | l3 | l4 | vibe;

    const report = [ 0x11, LL ];

    return [ report, { lights: option.lights }];

}) satisfies Signature

export const buildReport0x12 = ((option: { mode: number, continuous: boolean }, status) => {

    // including rumble bit just in case
    const TT = (option.continuous ? 0x04 : 0) | (status.rumble ? 0x01 : 0);
    const report = [ 0x12, TT, option.mode ];
    return [ report, {} ]

}) satisfies Signature

export const buildReport0x15 = ((option: null, status) => {

    const report = [ 0x15, status.rumble ? 0x01 : 0x00 ];
    return [ report, {} ];

}) satisfies Signature
