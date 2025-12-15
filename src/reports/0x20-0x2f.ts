import { Report } from "../types.js";
import { standard } from "../bindings/button.js";
import { buildReport0x12 } from "./0x10-0x1f.js";

/*
 * LIST OF REPORTS:
 * [x] 0x20 - Status Information
 * [ ] 0x21 - Read Memory and Registers - Data
 * [ ] 0x22 - Acknowledge output result, return function result
*/

const report0x20 = {
    type: 0x20,
    extract: (data, _, updateStatus) => { 
        // data 0 | 1 = buttons
        // data 2 - Lights and Flags
        // ignoring 2 0x01 nearly empty flag
        const extension_connected = (data[2] & 0x02) > 0;
        const speaker_enabled = (data[2] & 0x04) > 0;
        const ir_camera_enabled = (data[2] & 0x08) > 0;

        // invert order as one is LSB and for us one is MSB
        const l1 = (data[2] & 0x10) > 0 ? 0b1000 : 0;
        const l2 = (data[2] & 0x20) > 0 ? 0b0100 : 0;
        const l3 = (data[2] & 0x40) > 0 ? 0b0010 : 0;
        const l4 = (data[2] & 0x80) > 0 ? 0b0010 : 0;
        const lights = l1 | l2 | l3 | l4;

        // data 3 and 4 are skipped
        // 5 should be battery level
        const battery_level = data[5] / 255;

        // update state
        updateStatus({
            ir_camera_enabled,
            lights,
            speaker_enabled,
            battery_level,
            extension_connected
        })

        return { ...standard(data) }; // buttons are technically returned here, might as well
     },
    process: (status, updateStatus) => { // i must respond with a 0x12 reporting mode call.
        const [ report, next ] = buildReport0x12({ mode: status.monitor_mode, continuous: status.monitor_continuous }, status);
        updateStatus(next);
        return report;
    } 
} as const satisfies Report;



export const reports = [
    report0x20
] satisfies Report[];