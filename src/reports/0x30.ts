import { standard } from "../bindings/button.js";

declare global {
    namespace Wii {
        
    }
}

export const report = {
    type: 0x30,
    extract: (data) => { // used to extract information from the report
        return {
            ...standard(data),
        };
    },
    process: () => null // runs after the report to generate any outgoing data
} as const satisfies Wii.Report;