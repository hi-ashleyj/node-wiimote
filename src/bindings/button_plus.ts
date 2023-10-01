import { ButtonBinding } from "./+handlers.js";

export default ({
    name: "Plus",
    handler: "button_plus",
    action: "toggle",
    foundIn: {
        "0x30": {
            inByte: 1,
            atBit: 5
        }
    }
} as const) satisfies ButtonBinding;