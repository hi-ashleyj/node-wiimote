import { button } from "../bindings/button.js";
declare global {
    namespace Wii {
        interface Controls {
            "HOME": typeof control;
        }
    }
}

export const control = button("HOME")