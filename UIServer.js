var express = require('express'),
		app = express(),
		Config = require(__dirname+'/classes/Config'),
		Hub = require(__dirname+'/classes/Hub');

var config = new Config();

// once the hub is inited, start the UI
config.on('ready', function() {
	app.configure(function() {
		
		var hub = new Hub(config);
		
		// app configs
		app.use(express.bodyParser()); // handle POST/PUT
		app.use(express.cookieParser()); // enable sessions
		app.use(express.session({ secret: 'blargh' })); // configure sessions
		
		app.use('/', express.static(__dirname+'/ui'));
		
		// start the local hub & controllers
		app.get('/api/controller/start', function(req, res) {
			hub.once('started', function() { res.send({ started: hub.started }); });
			if (hub.started === false) { hub.start(); }
			else { res.send({ started: hub.started }); }
		});
		
		// stop the local
		app.get('/api/controller/stop', function(req, res) {
			hub.once('stopped', function() { res.send({ started: hub.started }); });
			if (hub.started === true) { hub.stop(); }
			else { res.send({ started: hub.started }); }
		});
		
		// restart the local controller
		app.get('/api/controller/restart', function(req, res) {
			hub.once('started', function() { res.send({ started: hub.started }); });
			if (hub.started === true) {
				hub.once('stopped', function() { hub.start(); });
				hub.stop();
			}
			else {
				hub.start();
			}
		});
		
		// list the active control clients
		app.get('/api/controllers', function(req, res) {
			var controllersJSON = [];
			hub.controllers.clients().forEach(function(client) {
				controllersJSON.push(client.toJSON());
			});
			res.send(controllersJSON);
		});
		
		// get JSON for a specific hub
		app.get('/api/controllers/:hub', function(req, res) {
			var controller = hub.controllers.clients(req.params.hub);
			if (controller) { res.send(controller.toJSON()); }
			else { res.send({}); }
		});
		
		// list the rooms for a specific hub
		app.get('/api/controllers/:hub/rooms', function(req, res) {
			var controller = hub.controllers.clients(req.params.hub);
			if (controller) { controller.getRooms(function(data) { res.send(data); });	}
			else { res.send({}); }
		});
		
	});
	
	// start the UI
	app.listen(config.json.expressPort);
	
});

config.read();