# node-wiimote
Basic easy to use Wiimote library for node.js.

Detection and initialization based on wii-controller
  
Thanks to Wiibrew for information on the communication standard.

## Latest Version
UPDATE HIGHLY RECOMMENDED - REQUIRES MANUAL EDITING OF PACKAGE.JSON OR REINSTALL @LATEST  
UPDATE IS MOSTLY BACKWARDS COMPATIBLE.
  
Changes to 0.2.0: 'The Events and Errors Update'    
  
Removed "colors" dependency as no longer required due

## Compatibility
Requires Wiimote, connected with bluetooth.  
Tested and works on Windows 10, other OSes unknown.  
wii-controller recommended use of this driver for Mac OS: <https://code.google.com/p/wjoy/>

## Installation

```bash
npm install node-wiimote --save
```

## Usage

```javascript
var Wiimote = require("node-wiimote"); // Require in library
var wii = new Wiimote(); // Initialize wiimote library 
  
if (wii.exists) {  
	var pressAToken = wii.on("button_a", "pressed", handlePressA); // Returns listener token used to remove listeners.  
    
	wii.off(pressAToken); // Takes listener token and removes listener
}  
```

### Listeners:
Supports all buttons (button_a, _b, etc)  
FUTURE - To support more types  

### Action types:

#### pressed
Triggered when a button is pressed down.

#### released
Triggered when a button is released.

### Feedback

#### wii.setLights(1, 2, 3, 4);
Takes 4 boolean values, and sets the lights (left to right)

#### wii.vibrate(<(true/false)|duration>);
Expects true or false, and enables or disables vibrate (rumble)  
Also allows a duration in milliseconds to be passed in.  
Please use either one within your project unless neccesary. May have unexpected behaviour if two timeouts overlap.

## Contributing
Pull requests are welcome. Actually, please do make improvements. Also can someone make this README actually good thanks.

## Licensing
Just use it. Give credit if you want.