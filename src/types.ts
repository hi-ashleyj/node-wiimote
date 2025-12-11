import type { Controls } from "./data.js";

export type State<T = any> = (state?: T) => T

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
    extract: (data: number[]) => Partial<{ [X in keyof Controls]: Parameters<Controls[X]["process"]>[0] }>
    process: () => number[] | null;
}
