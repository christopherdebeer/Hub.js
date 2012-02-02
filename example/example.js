
var newHub = new Hub()

newHub.setDebug(false)

newHub.set("user.name", "Christopher");

newHub.get("user.name", function(val){console.log("item [name]:", val)})

newHub.addGetter("user.sex", function() {
	var value = confirm("Are you male?") ? "male": "female";
	newHub.set(this.name, value)
})


newHub.get("user.sex", console.log)

newHub.set("user.fullname");


newHub.addGetter("user.fullname", function() {

	newHub.promise("user.fullname");
	newHub.addRequirements("user.fullname", ["user.name", "user.lastName"]);
	var item = this.name;
	newHub.get("user.name", function(n){
		newHub.get("user.lastName", function(ln){
			newHub.set(item, n + " " + ln);
		})
	})

})

newHub.addGetter("user.lastName", function(){

	newHub.promise("user.lastName")
	setTimeout(function(){
		newHub.set("user.lastName", "de Beer")
	}, 5000)

}, true)

newHub.get("user.fullname", function(val){console.log("[1] my Fullname is: ", val)})
newHub.get("user.fullname", function(val){console.log("[2] my Fullname is: ", val)})

newHub.dumpItems();