import type { Control, State } from "../types.js";
export const button = <T extends string>(key: T) => {
    return ({
        control: key,
        process: (data: number, store: State<number>) => {
            const s = store() ?? 0;
            if (data === s) return []; // no change

            store(data);
            if (data > 0) { // now pressed
                return [{
                    control: key,
                    action: "pressed" as const,
                    data: true,
                }]
            } else { // now released
                return [{
                    control: key,
                    action: "released" as const,
                    data: false,
                }]
            }
        }
    }) as const satisfies Control<boolean>;
}

export const standard = (data: number[]) => {
    return {
        A: (data[1] & 0x08) > 0 ? 1 : 0,
        B: (data[1] & 0x04) > 0 ? 1 : 0,
        "1": (data[1] & 0x02) > 0 ? 1 : 0,
        "2": (data[1] & 0x01) > 0 ? 1 : 0,
        MINUS: (data[1] & 0x10) > 0 ? 1 : 0,
        PLUS: (data[0] & 0x10) > 0 ? 1 : 0,
        HOME: (data[1] & 0x80) > 0 ? 1 : 0,
        DPAD_LEFT: (data[0] & 0x01) > 0 ? 1 : 0,
        DPAD_RIGHT: (data[0] & 0x02) > 0 ? 1 : 0,
        DPAD_UP: (data[0] & 0x08) > 0 ? 1 : 0,
        DPAD_DOWN: (data[0] & 0x04) > 0 ? 1 : 0,
    };
}

// Re-export Report here for ease of use
export type { Report } from "../types.js";