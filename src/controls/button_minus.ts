import { button } from "../bindings/button.js";
declare global {
    namespace Wii {
        interface Controls {
            "MINUS": typeof control;
        }
    }
}

export const control = button("MINUS")