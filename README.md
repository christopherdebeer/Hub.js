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

	// create out instance
	var myHub = new Hub()

	// create an entity and give it a value
	myHub.set("name", "Christopher")

	// create an entity but with no value
	myHub.set("fullname")

	// add requirements for that entity
	myHub.addRequirements("fullname", ["name", "lastname"])

	// describe how to get the value of that entity
	myHub.addGetter("fullname", function() {
		
		myHub.get("name", function(name) {
			myHub.get("lastname", function(lastname) {
				myHub.set("fullname", name + " " + lastname)		
			})
		})

	})

	// when fullname changes I want to do this (ie: a setter): 
	myHub.addSetter("fullname", function(){
		$("body h1").text("Hello, " + this.value)
	})

	// set a new item
	myHub.set("lastname", "de Beer")

Note that in the above oversimplified example, I defined what `fullname` was, what it required and what to do with the value. But `lastname` on which it depended was never defined until the very end. The Idea that is `Hub.js` is that *when* `lastname` is finally defined everything else will do as it should.

But...!!?
=========

**Hub.js** is still just an Idea and there is a lot I couldnt exaplain just yet as not everything it will do is implemented yet. So bare with me.


