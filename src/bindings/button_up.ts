import { ButtonBinding } from "./+handlers.js";

export default ({
    name: "D-Pad Up",
    handler: "button_up",
    action: "toggle",
    foundIn: {
        "0x30": {
            inByte: 1,
            atBit: 4
        }
    }
} as const) satisfies ButtonBinding;