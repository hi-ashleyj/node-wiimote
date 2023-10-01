import { ButtonBinding } from "./+handlers.js";

export default ({
    name: "A",
    handler: "button_a",
    action: "toggle",
    foundIn: {
        "0x30": {
            inByte: 2,
            atBit: 4
        }
    }
} as const) satisfies ButtonBinding;