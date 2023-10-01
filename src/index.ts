// import HID

import HID from "node-hid";
import { bindings } from "./bindings.js";

export const detectWiimotes = () => {
    const devices = HID.devices();
    devices.forEach((d) => {
        if (typeof d === "object" && d.product !== undefined) {
            if (d.product.toLowerCase().indexOf("rvl-cnt") !== -1) {
                // this is a wiimote!
            }
        }
    })
}

export { getControllers } from "./manager.js";
export const listEvents = () => {
    const out = {};
    for (const i in bindings) {
        out[i] = bindings[i].name;
    }
}

export { type SupportedEvents, type SupportedReports } from "./bindings/+handlers.js";
