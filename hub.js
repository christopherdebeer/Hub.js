
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
					dependants: [],
					lastGet: 0,
					lastSet: 0
				};
			} else {
				throw new Error("Item ["+item+"] already exists");
			}
		},
		addRequirements: function(item, requires) {
			if (typeof requires === 'string') requires = [requires];
			if (undef(items[item])) Hub.newItem(item, null);
			if (!undef(items[item])) {				
				if (requires instanceof Array) {
					for (x in requires) {
						if (debug) console.log("looping through requires:", requires[x])
						if (requires[x] !== "" && !undef(requires[x]) && requires[x] !== null) {
							items[item].requires[requires[x]] = true;
							if (undef(items[requires[x]])) Hub.newItem(requires[x]);
							items[requires[x]].dependants.push(item);
						} else {
							if (debug) console.log("A require was null or undefined or ''.")
						}
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

				if (debug) console.log("Item ["+item+"] had a value ["+items[item].value+"] and a getter ["+items[item].get+"]");
				
				// if the value is a promise, then wait
				if (items[item].value instanceof Promise) {
					if (debug) console.log("Already busy getting ["+item+"]. I'll get back to you when it arrives");
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
						Hub.promise(item);
						items[item].get();

					// this value has no unmet dependancies. then send
					} else callback(items[item].value);

					
				}

			// if the value is null and there is a getter, then ask and wait	
			} else if (items[item].value === null && !undef(items[item].get)) {
				
				items[item].callbacks.push(callback);
				Hub.promise(item);
				items[item].get();

			// if the item has a value but no getter, then send
			} else callback(items[item].value);

		},
		isPromise: function(item) {
			if (undef(items[item])) throw new Error("No such item ["+item+"] exists.");
			else return items[item].value instanceof Promise;
		},
		promise: function(item) {
			if (undef(items[item])) throw new Error("No such item ["+item+"] exists.");
			else items[item].value = new Promise();
			return true;
		},
		set: function(item, value) {

			if (undef(items[item])) {
				Hub.newItem(item, value);
			} else {
				if (items[item].value !== value) {
					items[item].value = value;

					// calling this items setter is it exists
					if (!undef(items[item].set)) items[item].set();

					// notifying all dependants of the change
					for (x in items[item].dependants) {
						if (debug) console.log("Item being set ["+item+"] has a dependant: ", items[item].dependants[x]);
						if (!undef(items[items[item].dependants[x]].get)) {
							if (debug) console.log("Notifying ["+items[item].dependants[x]+"] of the change.");
							Hub.promise(items[item].dependants[x]);
							items[items[item].dependants[x]].get();							
						} else {
							if (debug) console.warn("The dependant ["+items[item].dependants[x]+"] doesn't have a getter. ")
						}
					}

					if (debug) console.log("Notifying all callbacks of ["+item+"] of the value ["+value.toString()+"]");
					for (cb in items[item].callbacks) {
						if (debug) console.log("calling: ", items[item].callbacks[cb], " of ", item, " with ", value);
						items[item].callbacks[cb](value);
					}
					items[item].callbacks = [];
				} else {
					if (debug) console.log("No change to value.");
				}				
			}
			return true;		
		},
		addGetter: function (item, options) {

			if (typeof options === "function") {
				options.func = options
			}

			options["requires"] = options["requires"] || [];
			options["overide"] = options["overide"] || false;

			if (undef(options.func)) {
				if (debug) console.log("No getter passed in options ie: addGetter('item', { func: function() { .... }})")
				return false;
			} 

			if (!undef(items[item]) && !undef(items[item].get)) {

				if (!undef(options.overide) && options.overide === true) {
					if (debug) console.log("Overiding getter for:", item);
					items[item].get = options.func;
					Hub.addRequirements(item, options.requires)
					return true;
				} else {
					if (debug) console.warn("There is already a getter set for that item ["+item+"]: ", items[item].get);
			 		if (debug) console.info("Pass addGetter(item, func, overide) where Overide = true; to Overide.");
			 		return false;
				}		 	
			} else if (undef(items[item])) {
				Hub.newItem(item, null, options.func);
				Hub.addRequirements(item, options.requires)
				return true;
			} else {
				items[item].get = options.func;
				Hub.addRequirements(item, options.requires)
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
			if (window.console) console.info("Hub.js > Debug set to: ", s);
		}
	};
	return Hub;
};
