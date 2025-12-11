import { button } from "../bindings/button.js";
declare global {
    namespace Wii {
        interface Controls {
            "PLUS": typeof control;
        }
    }
}

export const control = button("PLUS")