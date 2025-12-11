import HID from "node-hid";
import { Context } from "./context.js";
import { EventEmitter } from "node:events";

type Events = {
    "error": [ any ]
    "action": []
}

export class Controller extends EventEmitter<Events> {

    vibrating = false;
    lightState = 0;
    exists = false;
    private device?: HID.HIDAsync;
    private path: string;
    connected = false;

    constructor(hidPath: string, context: Context) {
        super();
        this.path = hidPath;
    }

    // TODO: Make this actually do something
    async connect() {
        try {
            this.device = await HID.HIDAsync.open(this.path);
            this.device!.on("error", (err) => {
                this.emit("error", err);
            })
            
            // todo: idk if i need to check the data format here so just hard typing here
            this.device!.on("data", (data: number[]) => {

                
            });
        } catch (e) {
            console.error(e);
            throw new Error("Could not start Wiimote");
        }
    }

    // TODO: Make this actually do something
    async disconnect() {
        this.device.close();
        this.device = undefined;
    }

    sendData(data: number[]) {
        if (!this.device) return false;
        try {
            this.device.write(data);
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

}