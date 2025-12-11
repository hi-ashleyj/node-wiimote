import type { Control as WiiControl, Report as WiiReport, State as WiiState, WiimoteEvent as WiiEvent } from "./context.ts";

declare namespace Wii {
    interface Reports {}
    interface Controls {}

    type Control<T> = WiiControl<T>;
    type Report = WiiReport;
    type State<T> = WiiState<T>;
    type WiimoteEvent<T> = WiiEvent<T>;
}