import { ButtonBinding } from "./+handlers.js";

export default ({
    name: "D-Pad Right",
    handler: "button_right",
    action: "toggle",
    foundIn: {
        "0x30": {
            inByte: 1,
            atBit: 2
        }
    }
} as const) satisfies ButtonBinding;