import { standard, type Report } from "../bindings/button.js";

const report0x30 = {
    type: 0x30,
    extract: (data) => { return { ...standard(data) }; },
    process: () => null 
} as const satisfies Report;



export const reports = [
    report0x30,
]