import { ButtonBinding } from "./+handlers.js";

export default ({
    name: "D-Pad Down",
    handler: "button_down",
    action: "toggle",
    foundIn: {
        "0x30": {
            inByte: 1,
            atBit: 3
        }
    }
} as const) satisfies ButtonBinding;