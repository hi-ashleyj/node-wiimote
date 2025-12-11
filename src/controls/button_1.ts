import { button } from "../bindings/button.js";
declare global {
    namespace Wii {
        interface Controls {
            "1": typeof control;
        }
    }
}

export const control = button("1")