import HID from "node-hid";
import { Controller } from "./controller.js";
import { EventEmitter } from "node:events";

type Events = {
    "connect": [ Controller ];
    "disconnect": [ Controller ];
}

class WiimoteContext extends EventEmitter<Events> {
    
    private knownWiimotes = new Map<string, Controller>(); // boolean is connected state

    constructor() {
        super();
    }

    async refresh() {
        const devices = await HID.devicesAsync();
        const connected = new Set<string>();
        for (const dev of devices) {
            if (typeof dev !== "object") continue;
            if (!dev.product || !dev.product) continue;
            if (!dev.product!.toLowerCase().startsWith("rvl-cnt")) continue;
            connected.add(dev.path!);
        }
        const current = [ ...connected ];
        for (const [ known, c ] of this.knownWiimotes) {
            // if current connected == known connected then still connected
            // if not connected and not known connected then still disconnected
            if (c.connected === connected.has(known)) {
                connected.delete(known);
                continue;
            }
            // otherwise we need to do something
            if (c.connected) {
                // fire disconnect, currently missing from connected list
                this.emit("disconnect", c)
            } else {
                // fire connect
                this.emit("connect", c)
            }
            connected.delete(known);
        }
        for (const next of connected) {
            // everything left in connected is new, fire connect
            const controller = new Controller(next, this);
            this.knownWiimotes.set(next, controller);
        }

        return current;
    }

}

export type Context = WiimoteContext;

export const createContext = () => {
    if ("__wiimote_context__" in globalThis) return globalThis.__wiimote_context__;
    const ctx = new WiimoteContext();
    globalThis.__wiimote_context__ = ctx;
    return ctx;
}