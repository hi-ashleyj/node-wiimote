import { Controller } from "./controller.js";

const wiimotes = new Map<string, Controller>();

export const wiimoteDiscovered = (path: string) => {
    if (wiimotes.has(path)) return wiimotes.get(path);
    const controller = new Controller(path);
    wiimotes.set(path, controller);
    controller.onSystem('disconnect', () => disconnected(path));
}

const disconnected = (path: string) => {
    wiimotes.delete(path);
}

export const getControllers = () => {
    return [ ...wiimotes.values() ]
}