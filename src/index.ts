import { createContext, type Context } from "./context.js";
import type { Controls as Ctrls } from "./data.js";

// KEY API
export const createWii = (): Context => {
    return createContext();
}

export const createManager = () => {

}

export { createContext, type Context };
export type Controls = keyof Ctrls