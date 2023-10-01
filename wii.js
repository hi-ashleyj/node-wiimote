// 1: 0x01, 2: 0x02, 3: 0x04, 4: 0x08, 5: 0x10, 6: 0x20, 7: 0x40, 8: 0x80

var WiiController = function() {
	this.version = require("./package.json").version;
	this.last = {buttons: {}}; // Setup shit I need

	var u = this;
	
	// NOT MY CODE

	// NOW WE BACK TO MY CODE I WANT TO DIE AAAAAAAAAH
	// Fire event listener.
	this.hid.on("data", function(e) {
		// Detect Message type & Values
		if (e[0] == 0x30) { // Ensure message type == 0x30, this is default button type. And is all that is handled at the moment.
			var reportCode = "0x30";
			// Brace
			var found = {};
			var eventsToRun = {};

			// Do maths to this bitch
			var copiedBytes = [];

			for (var i = 0; i < e.length; i++) {
				copiedBytes.push(e[i]);
			}
			copiedBytes.shift();

			// Put maths in this bitch
			var bitsMap = [];

			// Bit conversion to a map in bitsMap[byteNum][bitNum]
			for (var i = 0; i < copiedBytes.length; i++) {
				bitsMap.push([]);
				for (var j = 0; j < 8; j ++) {
					var czech = Math.pow(2, (7 - j));
					if (copiedBytes[i] - czech >= 0) {
						copiedBytes[i] -= czech;
						bitsMap[i].push(true);
					} else {
						bitsMap[i].push(false);
					}
				}
				bitsMap[i].reverse();
			}


			// Now that I have a map of all the things, look through the bindings and convert it to values.
			for (var i = 0; i < u.bindings.length; i++) {
				var work = u.bindings[i];

				// If the binding is in this here report
				if (work.foundIn[reportCode] !== undefined) {
					// Then lets do some meth!
					// If it has a toggle type (such as buttons)
					if (work.actiontype == "toggle") {
						// It should have only one bit per report
						var sevn = work.foundIn[reportCode];

						found[work.handlerType] = {
							type: "toggle",
							value: bitsMap[sevn.inByte - 1][sevn.atBit - 1] == true
						}
					}
				}
			}

			// Find values

			// Then enumerate events, comparing then and firing events.

			// Now I should have some found values yay;

			var foundKeys = Object.keys(found); // BC IM LAZY
			var lastKeys = Object.keys(u.last);

			for (var i = 0; i < foundKeys.length; i++) { // Using foundkeys because I'm lazy as shit.
				if (lastKeys.indexOf(foundKeys[i]) == -1) {
					// Then it wasn't there the previous time
					if (found[foundKeys[i]].type = "toggle") {
						if (found[foundKeys[i]].value == true && false == false) { // If pressed now and not before,
							eventsToRun[foundKeys[i]] = "pressed"; // Saving that pressed event is correct
						} else if (found[foundKeys[i]].value == false && false == true) { // If released as an else if because fuck you and fuck me, that's why
							eventsToRun[foundKeys[i]] = "released"; // Saving that released event is correct
						}
					}
				} else {
					// Then it was there before so actually compare it twat
					if (found[foundKeys[i]].type = "toggle") {
						if (found[foundKeys[i]].value == true && u.last[foundKeys[i]].value == false) { // If pressed now and not before,
							eventsToRun[foundKeys[i]] = "pressed"; // Saving that pressed event is correct
						} else if (found[foundKeys[i]].value == false && u.last[foundKeys[i]].value == true) { // If released as an else if because fuck you and fuck me, that's why
							eventsToRun[foundKeys[i]] = "released"; // Saving that released event is correct
						}
					}
				}
			}

			// Now to fucking enumerate the events.
			// BTW: Assuming there will likely only be one change per call of this function.

			var eventKeysYawn = Object.keys(eventsToRun); // Lazy

			for (var i = 0; i < eventKeysYawn.length; i++) {
				var sevn = eventKeysYawn[i];
				for (var j = 0; j < u.eventListeners.length; j++) {
					if ((u.eventListeners[j].type == sevn || u.eventListeners[j].type == "all" || u.eventListeners[j].type == "*") && (u.eventListeners[j].action == eventsToRun[sevn] || u.eventListeners[j].action == "all" || u.eventListeners[j].action == "*")) {
						u.eventListeners[j].callback({type: sevn, action: eventsToRun[sevn]});
					}
				}
			}

			u.last = found; // Get ready for the next event
		}
	});

	this.on = function(type, action, callback) { // The most important function. Why? Because this makes sure nothing else gets shafted
		var typeSHIIIT = true;
		var actionSHIIIT = false;
		for (var i = 0; i < u.bindings.length; i++) {
			if (type == u.bindings[i].handlerType) {
				typeSHIIIT = false;
				break;
			}
		}
		
		if (type == "*" || type == "all") {
			typeSHIIIT = false;
		}
		
		if (action == "*" || action == "all") {
			actionSHIIIT = false;
		}
		
		if (typeSHIIIT) {
			throw "Invalid event type specified";
			return;
		}
		
		if (actionSHIIIT) {
			throw "Invalid action type specified";
			return;
		}
		
		var createdToken = new WiiListenerToken();
		this.eventListeners.push({
			type: type,
			action: action,
			callback: callback,
			token: createdToken,
		});
		
		return createdToken;
	};
	
}

module.exports = WiiController