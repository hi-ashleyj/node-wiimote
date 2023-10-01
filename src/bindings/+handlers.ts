export const supportedReports = [ "0x30", "0x20" ] as const;
export type SupportedReports = typeof supportedReports[number];

export type Buttons = "1" | "2" | "a" | "b" | "down" | "up" | "left" | "right" | "plus" | "minus" | "home";
export type ButtonEvents = `button_${Buttons}`;

export type SupportedEvents = ButtonEvents;

export type ButtonBinding<T = ButtonEvents> = {
    name: string,
    handler: T,
    action: "toggle",
    foundIn: Partial<Record<SupportedReports, { inByte: number, atBit: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 }>>
}

export type Binding = ButtonBinding;

export type RecordOfEvents = {
    [x in ButtonEvents]: ButtonBinding<x>;
}
