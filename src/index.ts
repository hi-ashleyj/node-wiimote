import { createContext, type Context as WiimoteRawContext } from "./context.js";
import type { Controls as Ctrls } from "./data.js";

// KEY API
export const createWii = (): WiimoteRawContext => {
    return createContext();
}

export const createManager = () => {

}

export const createRawWiimoteContext = (): WiimoteRawContext => {
    if ("__wiimote_context_usage_type__" in globalThis && globalThis.__wiimote_context_usage_type__ !== "raw") throw new Error("Do not use multiple context types in a project");
    if ("__wiimote_context_user__" in globalThis) return globalThis.__wiimote_context_user__;
    const ctx = createContext();
    globalThis.__wiimote_context_usage_type__ = "raw";
    globalThis.__wiimote_context_user__ = ctx;
    return ctx;
}

export { type WiimoteRawContext };
export type Controls = keyof Ctrls