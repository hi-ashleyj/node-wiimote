import type { Context as WiimoteRawContext } from "../context.js";
import { controls, type Controls } from "../data.js";
import type { ActionOf, EventOf, EventActionOf, WiimoteEvent } from "../types.js";
import { Controller } from "../controller.js";


type ControlItems = {
    [K in keyof Controls]: {
        on: <T extends ActionOf<K> | null>(action: T, fn: (e: T extends null ? EventOf<K> : EventActionOf<K, T>) => any | void) => () => any | void
    };
}

type SlotEvents = {
    "connected": [],
    "disconnected": [],
    "status": [],
}

type Slot = {
    on: (fn: () => any | void) => () => any | void;
    setStatus: Controller["setStatus"];
} & ControlItems


const slot = (register: (def: WiiEventDefinition) => () => void, num: 1 | 2 | 3 | 4): Slot => {
    
}

export type WiiEventDefinition<T extends keyof Controls = keyof Controls> = {
    slot: 1 | 2 | 3 | 4;
    control: T | null;
    action: ActionOf<T>;
    handler: (e: WiimoteEvent<T>) => void | any;
}

export class Wii { // we are not extending EventEmitter here, this is a custom implementation basically.

    private events = new Set<WiiEventDefinition>();
    private wiimotes = new Map<string, Controller>();
    private slots: [ string | null, string | null, string | null, string | null ] = [ null, null, null, null ];

    private context: WiimoteRawContext;
    /*
     * Assign modes work as follows:
     * 1 | 2 | 3 | 4 - assign to slot, and kick any active wiimote in that slot.
     * ignore - do not assign this wiimote
     * inactive - assign to itself, or the next INACTIVE slot (ie if there is a remote connected in slot 1, and a disconnected one in slot 2, a new remote is assigned to slot 3.)
     * next - assign always to the next disconnected slot (ie if there is a remote in slot 1, a disconnected in slot 2, and the remote used to be in slot 3, it will be assigned to slot 2 and removed from slot 3)
     */
    private assign: (params: { path: string, pass: "ignore" | 1 | 2 | 3 | 4, current: [ boolean, boolean, boolean, boolean ] }) => "inactive" | "next" | "ignore" | 1 | 2 | 3 | 4 = () => "inactive";

    constructor(context: WiimoteRawContext, assign: typeof this.assign) {
        this.context = context;
        this.assign = assign;

        this.context.on("connect", (controller) => {
            const current = this.slots.indexOf(controller.path) + 1;
            const next = this.slots.indexOf(null) + 1;
            const pass = (current > 0 ? current : next > 0 ? next : "ignore") as "ignore" | 1 | 2 | 3 | 4;
            const slot = this.assign({
                path: controller.path,
                current: this.slots.map(it => it !== null) as [ boolean, boolean, boolean, boolean ],
                pass: pass
            });

            controller.connect(); // controller is not automatically activated

            if (this.wiimotes.has(controller.path)) return; // controllers are not destroyed and are re-used if known, and so are events

            this.wiimotes.set(controller.path, controller);
            controller.on("error", () => {
                this.context.refresh(); // something went wrong, check bluetooth. if it's disconnected then we'll get a dc event later
            });
            controller.on("action", (action) => {
                // do events
            });

        });
        this.context.on("disconnect", (controller) => {
            controller.disconnect();
        })
    }

    private handleEvent = () => {

    }

    private register(def: WiiEventDefinition) {
        this.events.add(def);
        return () => {
            this.events.delete(def);
        }
    }

}