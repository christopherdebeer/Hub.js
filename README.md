Hub.js
------
*A paradigm looking for a purpose*

This is a thought experiment, I'm not sure where I'm going with it or what it *should* do. But everything seems to be going well.

**What is it**

The idea is that all values (entities) are stored in a central object/controller `Hub()` by settting and getting. All entities have (or don't have) Getter's and Setter's that are either used for retrieving their values or processing their values when they're updated/set.

Entities may have dependents or requirements (ie: they are dependents of other entities), and if their value is changed then all dependents are notified and/or updated accordingly.

The key paradigm is that Setter's and Getter's are independantly coded (self-contained) and can be worked on in isolation. Obviously if a given entity requires other entities then they aren't strictly self-contained. But they needn't be aware or even care *how* their requirements are met, only that they will be.

Usage
-----

*See (./example/index.html)[http://christopherdebeer.github.com/Hub.js/] for a functional example*

Create an instance:

	// create our instance
	var myHub = new Hub()

Then use it:

	// create an entity and give it a value
	myHub.set("name", "Christopher")

	// create an entity but with no value
	myHub.set("fullname")

	// describe how to get the value of that entity (including requirements)
	// note: all declared requires are passed into your function as one object
	myHub.addGetter("fullname", {
		requires: ["name", "lastname"],
		func: function(R) {		
			myHub.set("fullname", R.name + " " + R.lastname)
		}
	})

	// when fullname changes I want to do this (ie: a setter):
	// note: the value is passed into the function automatically when called
	myHub.addSetter("fullname", function(fN){
		$("body h1").text("Hello, " + fN)
	})

	// set a new item
	myHub.set("lastname", "de Beer")

Note that in the above oversimplified example, I defined what `fullname` was, what it required and what to do with the value. But `lastname` on which it depended was never defined until the very end. The Idea that is **Hub.js**, is that *when* `lastname` is finally defined everything else will do as it should.

But...!!?
=========

**Hub.js** is still just an Idea and there is a lot I couldnt exaplain just yet as not everything it will do is implemented yet. So bare with me.


Methods
----------

**get()**

	myHub.get("entity", callback(value))

**set()**

	myHub.set("entity", value)

**update()**

	myHub.update("entity", callback(value))

**addGetter()**

	myHub.addGetter("entity", getter())

	// or

	myHub.addGetter("entity", {
		requires: ["other", "entities"],
		overide: true, // optional
		func: function(requirements) {}
	})

**addSetter()**

	myHub.addSetter("entity", setter(value))

	// or

	myHub.addSetter("entity", {
		overide: false, // optional
		func: function(value) {}
	})

Other methods, used internally
---------------------------------

These methods are primarily for internal use, but are exposed if one wanted to use them I've documented their behaviour below.


**newItem()**
	
	// creates a new entity
	myHub.newItem("entity", value, getter, setter, requires)

**addRequirements()**
	
	// adds the passed entities as requirements of "entity"
	// "entity"'s getter:
	//	 - can only run if these are met/have a value
	// 	 - and will be run when they are updated/set/changed
	myHub.addRequirements("entity", ["these", "are", "required", "to", "Get", "theEntity"])

**promise()**
	
	// turns "entity" into a promise
	myHub.promise("entity")

**isPromise()**
	
	// returns true or false
	myHub.isPromise("entity")

**unmetRequires()**
	
	// returns an array of entities that are either not set or still being processed. ie: they are promised.
	// but on which "entity" is dependant.
	myHub.unmetRequires("entity")

**dumpItems()**

	// dumps all the values/prperties/entities/fucntions of myHub() to the cosnole (for debugging)
	myHub.dumpItems()

**setDebug()**
	
	// turns on Verbose logging of everything internal to Hub.js
	// accepts `true` or `false` defaults to true if no value is passed
	myHub.setDebug(true)



