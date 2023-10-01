import { ButtonBinding } from "./+handlers.js";

export default ({
    name: "Home",
    handler: "button_home",
    action: "toggle",
    foundIn: {
        "0x30": {
            inByte: 2,
            atBit: 8
        }
    }
} as const) satisfies ButtonBinding;