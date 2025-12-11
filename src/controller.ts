import HID from "node-hid";
import { Context } from "./context.js";
import { EventEmitter } from "node:events";
import { type Reports, type Controls, reports, controls } from "./data.js";
import { debugData } from "./debug.js";

type Events = {
    "error": [ any ]
    "action": [
        ReturnType<Controls[keyof Controls]["process"]>[number]
    ]
}

export class Controller extends EventEmitter<Events> {

    private device?: HID.HIDAsync;
    private context: Context;
    private path: string;
    private controlStates = new Map<keyof Controls, any>();

    connected = false;

    vibrating = false;
    lightState = 0;

    constructor(hidPath: string, context: Context) {
        super();
        this.path = hidPath;
        this.context = context;
    }

    private state(key: keyof Controls) {
        return (function (param?: any) {
            if (typeof param !== undefined) this.controlStates.set(key, param);
            return this.controlStates.get(key) ?? null;
        }).bind(this);
    }

    // TODO: Make this actually do something
    async connect() {
        try {
            this.device = await HID.HIDAsync.open(this.path);
            this.device!.on("error", (err) => {
                this.emit("error", err);
            })
            this.controlStates.clear();
            
            // todo: idk if i need to check the data format here so just hard typing
            this.device!.on("data", (data: number[]) => {
                if (data.length < 2) return; // this is nothing
                const reportType = data[0];
                const reportParser = reports.get(reportType);
                
                if (!reportParser) {
                    console.log("node-wiimote found an unknown report. we are working to improve support, so please make sure you have the latest version.");
                    console.log("If you'd like to help, please share the following debug information on github using the \"Unknown Report\" issue template.");
                    console.log("Alternatively, use the Wiimote documentation on Wiibrew to figure out what is going on and submit that, or fix it and submit a pull request.");
                    console.log("DATA STARTS HERE:");
                    console.log(`OS ${process.platform} | ARCH ${process.arch} | NODE ${process.version} | PACKAGE ${__MODULE_VERSION__}`);
                    if (process.versions && "electron" in process.versions && "chrome" in process.versions) console.log(`ELECTRON DETECTED: ${process.versions.electron} | CHROME ${process.versions.chrome}`)
                    console.log(debugData(data));
                    console.log("-".repeat(20));
                }
                const remaining = data.slice(1);

                const states = reportParser.extract(remaining);
                const targets = Object.keys(states) as (keyof typeof states)[];
                const events = targets.map(ctrl => {
                    return controls.get(ctrl)!.process(states[ctrl], this.state(ctrl));
                }).flat();
                
                events.forEach((it) => {
                    //@ts-expect-error (trust me bro it matches up)
                    this.emit("action", it);
                })
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
            this.connected = false;
            this.emit("error", e);
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