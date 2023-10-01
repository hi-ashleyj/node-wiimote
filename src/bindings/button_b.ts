import { ButtonBinding } from "./+handlers.js";

export default ({
    name: "B",
    handler: "button_b",
    action: "toggle",
    foundIn: {
        "0x30": {
            inByte: 2,
            atBit: 3
        }
    }
} as const) satisfies ButtonBinding;