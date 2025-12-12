Files:  
Note this is for now just to get parity not completeness
- [x] **/bindings** 
  - [x] **button.ts**
- [x] **/controls**
  - [x] **wiimote_buttons.ts**
- [ ] **/modes**
  - [ ] **manager.ts**
  - [ ] **wii.ts**
- [x] **/reports**
  - [x] **0x10-0x1f.ts**
  - [x] **0x20-0x2f.ts**
  - [x] **0x30-0x37.ts**
  - [x] **0x38-0x3f.ts**
- [x] **context.ts** *pretty sure this is all i need, the manager and wii modes should take over here*
- [ ] **controller.ts**
- [x] **data.ts**
- [x] **debug.ts**
- [ ] **index.ts**
- [ ] **types.ts**




TODO FOR FUTURE VERSIONS:
Planned for 0.3.0: 'The Listening Update'
	Allow passing in button_*/button_all for all button events
	Add other report types, and when incompatible report given possibly send back to known report	
	Add dynamically knowing and switching between different report modes based on event listeners
	Add directly calling .off() on the correct handler token
	
Planned for 0.4.0: 'The Motion Update'
	Add motion support
	+ Add recognizing the motion things
	+ Add event type: accelerate_
	+ Add event type: velocity_
	+ Add event type: rotation_
	+ Add event type: gesture_
	+ Add getter functions: distanceFromInit, rotation(),

Planned for 0.5.0: 'The Nunchuck Update'
	Add Nunchuck support - details to be worked out
	Possibly add motion plus support? If I do this will become 'the accessory update' and most external controllers will be added


