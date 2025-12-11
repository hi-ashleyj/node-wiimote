import { button } from "../bindings/button.js";
declare global {
    namespace Wii {
        interface Controls {
            "DPAD_LEFT": typeof control;
        }
    }
}

export const control = button("DPAD_LEFT")