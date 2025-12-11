import { button } from "../bindings/button.js";
declare global {
    namespace Wii {
        interface Controls {
            "B": typeof control;
        }
    }
}

export const control = button("B")