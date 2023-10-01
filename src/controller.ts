import HID from "node-hid";
import { ButtonEvents } from "./bindings/+handlers.js";
import { extractState } from "./bindings.js";

type SystemEvents = {
    disconnect: () => any
}

type SystemEventItem<K extends keyof SystemEvents> = {
    type: K,
    handler: SystemEvents[K]
}

type BindingEventActions = {
    [K in ButtonEvents]: "pressed" | "released"
}

type BindingEventHandlers = {
    [K in ButtonEvents]: ({}: { type: K, action: BindingEventActions[K] }) => any | void;
} & {
    "button_*": ({}: { type: ButtonEvents, action: BindingEventActions[ButtonEvents]}) => any | void;
}

type BindingEventItem<K extends keyof BindingEventHandlers> = {
    type: K,
    handler: BindingEventHandlers[K],
    action: "*" | Parameters<BindingEventHandlers[keyof BindingEventHandlers]>[0]["action"]
}

export class Controller {

    vibrating = false;
    lightState = 0;
    exists = false;
    onListeners = new Set<BindingEventItem<keyof BindingEventHandlers>>();
    systemListeners = new Set<SystemEventItem<keyof SystemEvents>>();
    HID: HID.HID;

    constructor(hidPath: string) {
        this.HID = new HID.HID(hidPath);

        try {
            this.HID.on("data", function(e) {
                this.exists = true;
                this.processIncoming(e);
            }.bind(this));
        } catch (e) {
            console.error(e);
            throw new Error("Could not start Wiimote");
        }
        this.exists = true;
        this.HID.on("error", () => {
            console.log("The Wii controller had an error")
        });
    }

    onSystem<T extends keyof SystemEvents>(type: T, handler: SystemEvents[T]): () => any {
        const combined = {
            type: type,
            handler: handler,
        }
        this.systemListeners.add(combined);
        return (function () {
            this.systemListeners.delete(combined)
        }).bind(this);

    }

    sendData(data: number[]) {
        if (!this.exists) return false;
        try {
            this.HID.write(data);
            return true;
        } catch (e) {
            this.exists = false;
            console.error(e);
            throw new Error("This client is probably disconnected.");
        }
    }

    processIncoming(data: number[]) {
        // check for special reports
        switch (data[0]) {
            case 0x20: { // We just received a status report. We need to handle this, then change reporting mode back.
                this.sendData([0x12, 0x00, 0x30]);
                break;
            }
        }
        const state = extractState(data);


    }

    setLight(light: 1 | 2 | 3 | 4, to: boolean) {
        const bitwise = Math.pow(2, light - 1) * 16;
        const isOn = (this.lightState & bitwise) > 0;
        if (isOn === to) return true; // no change, do nothing.
        if (isOn) { // to must be false
            this.lightState -= bitwise;
        } else { // must not be on and to must be true
            this.lightState += bitwise;
        }
        return this.sendData([0x11, this.lightState + (this.vibrating ? 1 : 0)]); // i love ternary operators smile
    }

    setLights(lx1: boolean, lx2: boolean, lx3: boolean, lx4: boolean) {
        let total = lx1 ? 16 : 0;
        if (lx2) total += 32;
        if (lx3) total += 64;
        if (lx4) total += 128;
        this.lightState = total;
        return this.sendData([0x11, this.lightState + (this.vibrating ? 1 : 0)]);// i love ternary operators smile
    }

    vibrate(state: boolean) {
        this.vibrating = state; // remember current vibration;
        const total = this.lightState + (state ? 1 : 0); // vibration and lights are in the same packet
        return this.sendData([0x11, total]);
    }

    vibrateFor(ms: number) {
        if (ms < 10) throw new Error("Not possible to vibrate for less than 10ms");
        setTimeout(() => {
            this.vibrate(false);
        }, ms);
        this.vibrate(true);
    }

    on<T extends keyof BindingEventHandlers>(type: T, action: BindingEventItem<T>["action"], handler: BindingEventHandlers[T]): () => any | void {
        const combined = {
            type,
            action,
            handler,
        };
        this.onListeners.add(combined);
        return () => {
            this.onListeners.delete(combined)
        }
    }

}