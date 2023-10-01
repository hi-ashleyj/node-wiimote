import { ButtonBinding } from "./+handlers.js";

export default ({
    name: "One",
    handler: "button_1",
    action: "toggle",
    foundIn: {
        "0x30": {
            inByte: 2,
            atBit: 2
        }
    }
} as const) satisfies ButtonBinding;