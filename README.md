Hub.js
------
*A paradigm looking for a purpose*

This is a thought experiment, I'm not sure where I'm going with it or what it *should* do. But everything seems to be going well.

**What is it**

The idea is that all values (entities) are stored in a central object/controller `Hub()` by settting and getting. All entities have (or don't have) Getter's and Setter's that are either used for retrieving their values or processing their values when they're updated/set.

Entities may have dependents or requirements (ie: they are dependents of other entities), and if their value is changed then all dependents are notified and/or updated accordingly.

The key paradigm is that Setter's and Getter's are independantly coded (self-contained) and can be worked on in isolation. Obviously if a given entity requires other entities then they aren't strictly self-contained. But they needn't be aware or even care *how* their requirements are met, only that they will be.

**Usage**

*See ./example for an example*

	// create our instance
	var myHub = new Hub()

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

Note that in the above oversimplified example, I defined what `fullname` was, what it required and what to do with the value. But `lastname` on which it depended was never defined until the very end. The Idea that is `Hub.js` is that *when* `lastname` is finally defined everything else will do as it should.

Getters and Setters have two possible assignment syntaxes:

	// The one used above ie "entity" & {options}

	var options = {
		requires: ["another.entity", "..."]
		func: function(){
			// ...
		}
	}

	myHub.addGetter("entity", options)

	// or if you dont have any options other than the function then you can do
	// this. See how my "Setter" functions are done in the example given earlier

	myHub.addGetter("entity", function(){
		// ...
	})

But...!!?
=========

**Hub.js** is still just an Idea and there is a lot I couldnt exaplain just yet as not everything it will do is implemented yet. So bare with me.


