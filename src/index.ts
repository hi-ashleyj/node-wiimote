import { createContext, type Context } from "./context.js";

// KEY API
export const createWii = (): Context => {
    return createContext();
}

export const createManager = () => {

}

export type Controls = keyof Wii.Controls