
var Hub = function(){
	
	var items = {};
	var debug = true;

	function Promise(){};
	function undef(obj) {
		if (typeof obj !== 'undefined') return false;
		else return true;
	}

	var Hub = {
		dumpItems: function(){
			if (debug) console.log(items);
			// else console.log("You called dumpItems with debug disabled, To enable: myHub.setDebug(true); ")
		},
		newItem: function(item, value, getter, setter, requires) {
			
			value = value || null;
			getter = getter || undefined; // function(){Hub.set(item, this.value === null ? new Error("No Value and no Getter") : this.value);};
			setter = setter || undefined; // function(){};
			requires = requires || {};

			if (debug) console.log("Creating new Item: ", item);
			if (undef(items[item])) {
				items[item] = {
					name: item,
					value: value,
					get: getter,
					set: setter,
					callbacks: [],
					requires: {},
					lastGet: 0,
					lastSet: 0
				};
			} else {
				throw new Error("Item ["+item+"] already exists");
			}
		},
		addRequirements: function(item, requires) {

			if (!undef(items[item])) {
				if (typeof requires === 'string') requires = [requires];
				if (requires instanceof Array) {
					for (x in requires) {
						items[item].requires[requires[x]] = true;
					}
				} else {
					throw new Error("Invalid require value for ["+item+"]. Accepts Array of Strings or String.")
				}
			} else {
				throw new Error("Item ["+item+"] doesnt exist");
			}
			
		},
		get: function (item, callback) {

			// if there's no such item, then error
			if (undef(items[item])) callback(new Error("No Such item ["+item+"]"));

			// if the item is null and has no getter, then error
			else if (items[item].value === null && undef(items[item].get)) callback(new Error("No Getter is set for that item ["+item+"], and Value is <null>."));
			
			// if the item has a value and a getter 
			else if (items[item].value !== null && !undef(items[item].get)) {

				if (debug) console.log("item had a val and a getter");
				
				// if the value is a promise, then wait
				if (items[item].value instanceof Promise) {
					if (debug) console.log("busy getting I'll get back to you when it arrives");
					items[item].callbacks.push(callback);
				
				// if the value is not a promise
				} else {

					// if this value has dependancies that are not met, then ask & wait
					var requirements = items[item].requires;
					var req = []; // unmet requirements. ie: Promise or null
					for (x in requirements) {
						if (Hub.isPromise(requierments[x]) || Hub.hasValue(requierments[x])) req.push(requierments[x])
					}
					if (req.length > 0) {
						if (debug) console.log("The are unmet dependancies for ["+item+"] ie: outstanding promises, waiting for them: ", req);
						items[item].callbacks.push(callback);
						items[item].get();

					// this value has no unmet dependancies. then send
					} else callback(items[item].value);
				}

			// if the value is null and there is a getter, then ask and wait	
			} else if (items[item].value === null && !undef(items[item].get)) {
				
				items[item].callbacks.push(callback);
				items[item].get();

			// if the item has a value but no getter, then send
			} else callback(items[item].value);

		},
		isPromise: function(item) {
			if (undef(items[item])) throw new Error("Not such item ["+item+"] exists.");
			else return items[item].value instanceof Promise;
		},
		promise: function(item) {
			if (undef(items[item])) throw new Error("Not such item ["+item+"] exists.");
			else items[item].value = new Promise();
			return true;
		},
		set: function(item, value) {

			if (undef(items[item])) {
				Hub.newItem(item, value);
			} else {
				if (debug) console.log("notifying all callbacks of ["+item+"] of the value ["+value.toString()+"]");
				for (cb in items[item].callbacks) {
					if (debug) console.log("calling: ", items[item].callbacks[cb], " of ", item, " with ", value);
					var call = items[item].callbacks[cb];
					call(value);
				}
				items[item].value = value;
				items[item].callbacks = [];
			}
			return true;		
		},
		addGetter: function (item, func, overide) {
			if (!undef(items[item]) && !undef(items[item].get)) {

				if (!undef(overide) && overide === true) {
					if (debug) console.log("Overiding getter for:", item);
					items[item].get = func;
					return true;
				} else {
					if (debug) console.warn("There is already a getter set for that item ["+item+"]: ", items[item].get);
			 		if (debug) console.info("Pass addGetter(item, func, overide) where Overide = true; to Overide.");
			 		return false;
				}		 	
			} else if (undef(items[item])) {
				Hub.newItem(item, null, func);
				return true;
			} else {
				items[item].get = func;
				return true;
			}
		},
		addSetter: function (item, func, overide) {
			if (!undef(items[item]) && !undef(items[item].set)) {

				if (!undef(overide) && overide === true) {
					if (debug) console.log("Overiding setter for:", item);
					items[item].set = func;
					return true;
				} else {
					if (debug) console.warn("There is already a setter set for that item ["+item+"]: ", items[item].get);
			 		if (debug) console.info("Pass addSetter(item, func, overide) where Overide = true; to Overide.");
			 		return false;
				}		 	
			} else if (undef(items[item])) {
				Hub.newItem(item, null, null, func);
				return true;
			} else {
				items[item].set = func;
				return true;
			}
		},
		setDebug: function(s) {
			if (typeof s === 'undefined') s = true;
			debug = s;
			if (s) console.info("Hub.js > Debug set to true.");
		}
	};
	return Hub;
};
