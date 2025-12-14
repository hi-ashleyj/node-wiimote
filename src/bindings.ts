import { RecordOfEvents, SupportedReports, supportedReports } from "./bindings/+handlers.js";
import button_left from "./bindings/button_left.js";
import button_right from "./bindings/button_right.js";
import button_1 from "./bindings/button_1.js";
import button_2 from "./bindings/button_2.js";
import button_a from "./bindings/button_a.js";
import button_b from "./bindings/button_b.js";
import button_down from "./bindings/button_down.js";
import button_home from "./bindings/button_home.js";
import button_minus from "./bindings/button_minus.js";
import button_plus from "./bindings/button_plus.js";
import button_up from "./bindings/button_up.js";

export const bindings: RecordOfEvents = {
    [button_1.handler]: button_1,
    [button_2.handler]: button_2,
    [button_a.handler]: button_a,
    [button_b.handler]: button_b,
    [button_down.handler]: button_down,
    [button_home.handler]: button_home,
    [button_left.handler]: button_left,
    [button_minus.handler]: button_minus,
    [button_plus.handler]: button_plus,
    [button_right.handler]: button_right,
    [button_up.handler]: button_up
} as const

const bitMapper = (bit) => {
    return [
        (bit & 0x01) > 0,
        (bit & 0x02) > 0,
        (bit & 0x04) > 0,
        (bit & 0x08) > 0,
        (bit & 0x10) > 0,
        (bit & 0x20) > 0,
        (bit & 0x40) > 0,
        (bit & 0x80) > 0,
    ] as const
};

type State = {
    [x in keyof typeof bindings]: (typeof bindings)[x]["action"] extends "toggle" ? boolean : never
}




export const extractState = (report: number[]): Partial<State> => {
    const information = report.slice(1).map(bitMapper);

    const reportCode  = "0x" + report[0].toString(16).padStart(2, "0");

    if (!supportedReports.some(v => v === reportCode)) {
        console.log("I found a report that I have no idea what to do with");
        // removed __MODULE_VERSION__ as it triggered errors that weren't catchable, instead it now just uses the package version
        console.log("We are working very hard to support all types of report, so please make sure you have the latest version. Current: " + require("./package.json").version);
        console.log("If you have the latest version, keep a note of the following information");
        console.log("Please send it in as a bug report on git, if there is already data that matches yours just comment on it please!");
        console.log("Alternatively, use the Wiimote documentation on Wiibrew to figure out what is going on and submit that, or fix it and submit a pull request.");
        throw new Error();
    }

    const stateMap: Partial<State> = {};

    for (let key in bindings) {
        const bind = bindings[key as keyof typeof bindings];

        if (bind.action == "toggle" && bind.foundIn[reportCode]) {
            stateMap[bind.handler] = information[bind.foundIn[reportCode].inByte - 1][bind.foundIn[reportCode].atBit - 1];
        }
    }

    return stateMap;
}
