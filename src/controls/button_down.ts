import { button } from "../bindings/button.js";
declare global {
    namespace Wii {
        interface Controls {
            "DPAD_DOWN": typeof control;
        }
    }
}

export const control = button("DPAD_DOWN")