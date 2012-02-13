
var express = require('express'),
	app = express.createServer(),
	fs = require("fs"),
	Hub = require("../hub.js");

myHub = new Hub();
myHub.setupClients({
	server: app,
	scope: "ux"
});


// Configure Express 
app.configure( function() {

  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(myHub.middleware);
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


myHub.set("name", "christopher");
myHub.set("fullname", "christopher de beer")
myHub.set("ux.fullname", "christopher de beer")
myHub.set("client.anon.ux.fullname", "christopher de beer")




app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});


app.get("/", function(req, res) {
	myHub.setClientEntity(req, "ux.test", "testing client entities")
	fs.readFile('./client.html', function(error, content) {
        if (error) {
            res.writeHead(500);
            res.end("error: " + error);
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(content);
        }

	});
})


// Run app
app.listen(80);