import { ButtonBinding } from "./+handlers.js";

export default ({
    name: "D-Pad Left",
    handler: "button_left",
    action: "toggle",
    foundIn: {
        "0x30": {
            inByte: 1,
            atBit: 1
        }
    }
} as const) satisfies ButtonBinding;