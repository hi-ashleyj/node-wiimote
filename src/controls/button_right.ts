import { button } from "../bindings/button.js";
declare global {
    namespace Wii {
        interface Controls {
            "DPAD_RIGHT": typeof control;
        }
    }
}

export const control = button("DPAD_RIGHT")