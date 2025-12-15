import type { Report, Control, State, WiimoteEvent } from "./types.js";

// IMPORT ALL CONTROL HANDLERS
import { buttons } from "./controls/wiimote_buttons.js";

// TYPE WORK
type AllControls = (typeof buttons[number])
export type Controls = {
    [K in AllControls["control"]]: Extract<AllControls, { control: K }>;
}

// FLIP AND RETURN
const controls = new Map<keyof Controls, Control<any>>();
const lsc = [ ...buttons ];
for (let r of lsc) {
    controls.set(r.control, r);
}

// IMPORT ALL REPORT HANDLERS
import { reports as x20 } from "./reports/0x20-0x2f.js";
import { reports as x30 } from "./reports/0x30-0x37.js";
import { reports as x38 } from "./reports/0x38-0x3f.js";

// TYPE WORK
type AllReports = (typeof x20[number] | typeof x30[number] | typeof x38[number]);
export type Reports = {
    [K in AllReports["type"]]: Extract<AllReports, { type: K }>;
}

// FLIP AND RETURN
const reports = new Map<number, Report>();
const lsr = [ ...x20, ...x30, ...x38 ];
for (let r of lsr) {
    reports.set(r.type, r);
}

export { reports, controls };