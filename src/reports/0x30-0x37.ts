import { standard, type Report } from "../bindings/button.js";

/*
 * LIST OF REPORTS:
 * [x] 0x30 - Core Buttons
 * [ ] 0x31 - Core Buttons with Accelerometer
 * [ ] 0x32 - Core Buttons with 8 extension bytes
 * [ ] 0x33 - Core Buttons with Accelerometer and 12 IR bytes
 * [ ] 0x34 - Core Buttons with 19 extension bytes
 * [ ] 0x35 - Core Buttons with Accelerometer and 16 extension bytes
 * [ ] 0x36 - Core Buttons with 10 IR bytes and 9 extension bytes
 * [ ] 0x37 - Core Buttons with Accelerometer and 10 IR bytes and 6 extension bytes
*/

const report0x30 = {
    type: 0x30,
    extract: (data) => { return { ...standard(data) }; },
    process: () => null 
} as const satisfies Report;



export const reports = [
    report0x30,
]