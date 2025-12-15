# Node-Wiimote docs
Basic easy to use Wiimote library for node.js.  
  
## Contents:
- [Get Started](#get-started)
  - [Installation](#installation)
  - [Initialise](#initialise)
- [Wii vs Manager]
- [Events](#events)
  - [Behaviour]
  - [Buttons]
    - [Types](#types)
    - [Actions](#actions)
- [Feedback]
  - [Haptics]
  - [Lights]

## Get Started
### Installation
```sh
npm install node-wiimote --save
```
### Initialise
```ts
// do all your wii setup in one file, then import it where you need it. use only one of the following options in your project
import { createWii, createManager } from "node-wiimote";

// "wii" mode - wiimotes are assigned to 4 slots with reconnect etc
export const wii = createWii();

// "manager" mode - wiimotes are handled by client code
export const wii = createManager();

// "raw" mode - should be used sparingly - directly passes through underlying api for advanced usage
export const wii = createRawWiimoteContext();
```
## Events
<h3 id="hd2_1">2.1 Behaviour</h3>
Each event has a "type" and an "action"<br />
The event type is used to target the button, sensor, or other devices the user can interface with.<br />
The event action is used to specify what the user does (press button, movement etc)<br />
<br />
Also available are the <span class="code-inline">all</span> and <span class="code-inline">*</span> keywords<br />
These may be used in place of types and/or actions as wildcards. ie:<br />
An event listener with <span class="code-inline">type: "button_a", action: "all"</span> will trigger for every action on the a button. <br />
An event listener with <span class="code-inline">type: "all", action: "pressed"</span> will trigger for a pressed event on any device. <br />
An event listener with <span class="code-inline">type: "all", action: "all"</span> will trigger for every device. <br />
<br />
<span class="comment">Use of "*" may change with regards to removing events. If you need to remove the event with no breakage in future versions, "all" should be used.</span><br />
<br />
The <span class="code-inline">wii.on()</span> function returns a WiiListenerToken that can be used to remove that event listener.<br />
That can be done by simply passing it into <span class="code-inline">wii.off(<span class="lblue">token</span>)</span><br />
You can also remove all events with specific types and actions by using <span class="code-inline">wii.off(<span class="lblue">type</span>, <span class="lblue">action</span>)</span><br />
<br />
Note that unlike specifying <span class="code-inline">all</span> or <span class="code-inline">*</span> with events, using <span class="code-inline">all</span> or <span class="code-inline">*</span> to remove events only removes events with the types/actions <span class="code-inline">all</span> or <span class="code-inline">*</span>, ie:<br />
Remove with <span class="code-inline">type: "all", action: "pressed"</span> will only remove events that match <span class="code-inline">type: "all", action: "pressed"</span>, and not other events with <span class="code-inline">action: "pressed"</span><br />
<br />
<span class="comment">Note that in future "*" may change to be a wildcard in removing events and not specific (as it is currently). For future compatibility with removing events, you should use "all"</span>

### Buttons
#### Types
A  
B  
1  
2  
MINUS  
PLUS  
HOME  
DPAD_LEFT  
DPAD_RIGHT  
DPAD_UP  
DPAD_DOWN  

#### Actions
**pressed**  
Triggered when a button is pressed down.  
  
**released**
Triggered when a button is released.  
