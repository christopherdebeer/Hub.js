var Hub 	= require("../hub.js"),
	assert 	= require('assert');

var myHub = new Hub();
myHub.setDebug(false);

describe("Hub.js", function(){
	
	it('should return a instanceof Hub()', function(done){
		assert.ok(myHub instanceof Hub);
		done();
	})

	it('should return true when setting an entity', function(done){
		assert.ok(myHub.set("name", "Christopher"));
		done();
	})

	it('should return true when getting an entity', function(done){
		assert.ok(myHub.get("name", function(){}));
		done();
	})

	it('should call the callback with value when getting an entity', function(done){
		myHub.get("name", function(x){
			assert.equal(x,"Christopher");
			done();
		})
	})

	it('should call the Setter when the value is set (and changed)')

	it('should Not call the setter if there is no change')

	it('should call the getter when a dependancy changes')

})
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
	//$("body h1").text("Hello, " + fN)
})

// set a new item
myHub.set("lastname", "de Beer")