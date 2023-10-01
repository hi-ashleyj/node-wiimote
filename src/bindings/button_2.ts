import { ButtonBinding } from "./+handlers.js";

export default ({
    name: "Two",
    handler: "button_2",
    action: "toggle",
    foundIn: {
        "0x30": {
            inByte: 2,
            atBit: 1
        }
    }
} as const) satisfies ButtonBinding;