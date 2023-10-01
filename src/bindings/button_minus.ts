import { ButtonBinding } from "./+handlers.js";

export default ({
    name: "Minus",
    handler: "button_minus",
    action: "toggle",
    foundIn: {
        "0x30": {
            inByte: 2,
            atBit: 5
        }
    }
} as const) satisfies ButtonBinding;