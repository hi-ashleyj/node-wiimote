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
  - [List Events]

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
button_a  
button_b  
button_1  
button_2  
button_plus  
button_minus  
button_left  
button_right  
button_up  
button_down  
button_home  

#### Actions
**pressed**  
Triggered when a button is pressed down.  
  
**released**
Triggered when a button is released.  
  
## Feedback
### Haptics/Rumble
```ts
wiimote.
```
<h3 id="hd3_1">3.1 Haptics/Rumble/Vibration</h3>
<div class="code">
    wii.<span class="dblue">vibrate</span>(<span class="lblue">&lt;(true/false)|duration&gt;</span>);
</div>
<br />
Expects and does as the following:</br>
<span class="code-inline">true/false (boolean)</span>: Enables/Disables vibration or rumble feature</br>
<span class="code-inline">duration (number, milliseconds)</span>: Enables vibration for a set length of time</br>
<h3 id="hd3_2">3.2 Lights</h3>
<div class="code">
    wii.<span class="dblue">setLights</span>(<span class="lblue">1</span>, <span class="lblue">2</span>, <span class="lblue">3</span>, <span class="lblue">4</span>);
</div>
<br />
Takes 4 boolean values and turns on the LEDs on the bottom of the Wiimote (left to right)
<br />
<h3 id="hd3_3">3.2 List Events</h3>
<div class="code">
    wii.<span class="dblue">listEvents</span>(<span class="lblue">toConsole*</span>);
</div>
<br />
Returns an object with all events in <span class="code-inline">eventType: prettyName</span> format.<br />
If toConsole is true, prints the list to the console instead.<br />
If toConsole is not present, it is assumed to be false.
