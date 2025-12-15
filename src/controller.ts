import HID from "node-hid";
import { EventEmitter } from "node:events";
import { type Controls, reports, controls } from "./data.js";
import { debugData } from "./debug.js";
import type { ControllerStatus, ControllerWritable } from "./types.js"; 
import { buildReport0x10, buildReport0x11, buildReport0x12 } from "./reports/0x10-0x1f.js";

type WiimoteControllerError = {
    code: "write/fail" | "connect/fail"
    message: string,
    cause: any
}

type Events = {
    "error": [ WiimoteControllerError ]
    "action": [
        ReturnType<Controls[keyof Controls]["process"]>[number]
    ]
}

export class Controller extends EventEmitter<Events> {

    private device?: HID.HIDAsync;
    readonly path: string;
    private controlStates = new Map<keyof Controls, any>();
    private status: ControllerStatus = {
        rumble: false,
        lights: 0,
        speaker_enabled: false,
        speaker_muted: true,
        ir_camera_enabled: false,
        battery_level: 0,
        extension_connected: false,
        monitor_continuous: false,
        monitor_mode: 0x30
    }

    connected = false;
    constructor(hidPath: string) {
        super();
        this.path = hidPath;
    }

    private state(key: keyof Controls) {
        return (function (param?: any) {
            if (typeof param !== undefined) this.controlStates.set(key, param);
            return this.controlStates.get(key) ?? null;
        }).bind(this);
    }

    async connect() {
        try {
            this.device = await HID.HIDAsync.open(this.path);
            this.device!.on("error", (err) => {
                this.emit("error", err);
            })
            
            // todo: idk if i need to check the data format here so just hard typing
            this.device!.on("data", (data: number[]) => {
                this.connected = true;
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

                const states = reportParser.extract(remaining, this.status, this.updateStatus);
                const after = reportParser.process(this.status, this.updateStatus);
                if (after !== null) this.sendData(after);
                const targets = Object.keys(states) as (keyof typeof states)[];
                const events = targets.map(ctrl => {
                    return controls.get(ctrl)!.process(states[ctrl], this.state(ctrl));
                }).flat();
                
                events.forEach((it) => {
                    //@ts-expect-error (trust me bro it matches up)
                    this.emit("action", it);
                })
            });
            this.controlStates.clear();
            this.connected = true;
            this.sendData([ 0x15, 0x00 ]);
        } catch (e) {
            this.emit("error", {
                code: "connect/fail",
                message: "Could not start Wiimote",
                cause: e
            })
        }
    }

    async disconnect() {
        this.connected = false;
        this.device.close();
        this.device = undefined;
    }

    private sendData(data: number[]) {
        if (!this.device) return false;
        try {
            this.device.write(data);
            return true;
        } catch (e) {
            this.connected = false;
            this.emit("error", {
                code: "write/fail",
                message: "Failed to write data",
                cause: e
            });
        }
    }

    getStatus() {
        return Object.assign({}, this.status);
    }

    setStatus(stat: Partial<ControllerWritable>) {
        let update: Partial<ControllerStatus> = {};
        const state = () => Object.assign({}, this.status, update);
        if ("rumble" in stat && typeof stat.rumble === "boolean") {
            const [ report, states ] = buildReport0x10({ rumble: stat.rumble });
            this.sendData(report);
            Object.assign(update, states);
        }
        if ("lights" in stat && typeof stat.lights === "number") {
            const [ report, states ] = buildReport0x11({ lights: stat.lights }, state());
            this.sendData(report);
            Object.assign(update, states);
        }
        this.updateStatus(update);
    }

    setMonitorMode(mode: number, continuous: false) {
        // continuous is forced false cause no need to hold onto it
        if (this.status.monitor_mode === mode && this.status.monitor_continuous === continuous) return;
        const [ report, states ] = buildReport0x12({ mode, continuous }, this.getStatus());
        this.sendData(report);
        this.updateStatus(states);
    }

    private updateStatus(stat: Partial<ControllerStatus>) {
        this.status = Object.assign({}, this.status, stat);
    }

}