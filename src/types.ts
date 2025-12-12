import type { Controls } from "./data.js";

export type State<T = any> = (state?: T) => T | null

export type Control<T> = {
    control: string;
    process: (data: any, store: State) => WiimoteEvent<T>[];
}

export type WiimoteEvent<T> = {
    control: string;
    action: string;
    data: T;
}

export type Report = {
    type: number,
    extract: (data: number[], status: ControllerStatus, update: (partial: Partial<ControllerStatus>) => void | any) => Partial<{ [X in keyof Controls]: Parameters<Controls[X]["process"]>[0] }>
    process: (status: ControllerStatus, update: (partial: Partial<ControllerStatus>) => void | any) => number[] | null;
}

export type ControllerWritable = {
    rumble: boolean,
    lights: number,
    speaker_enabled: boolean,
    speaker_muted: boolean,
    ir_camera_enabled: boolean,
}

export type ControllerStatus = ControllerWritable & {
    battery_level: number,
    extension_connected: boolean,
    monitor_mode: number,
    monitor_continuous: boolean,
}