import { button } from "../bindings/button.js";
declare global {
    namespace Wii {
        interface Controls {
            "A": typeof control;
        }
    }
}

export const control = button("A")