var express = require('express'),
		app = express(),
		Hub = require(__dirname+'/classes/Hub');

var hub = new Hub();

// once the hub is inited, start the UI
hub.on('init', function() {
	app.configure(function() {
		
		// app configs
		app.use(express.bodyParser()); // handle POST/PUT
		app.use(express.cookieParser()); // enable sessions
		app.use(express.session({ secret: 'blargh' })); // configure sessions
//		app.use(express.logger({ stream: accessLog }));
		
		app.use('/', express.static(__dirname+'/ui'));
		
		app.get('/api/hubs', function(req, res) {
			res.send(hub.config.json.hubs);
		});
		
		app.get('/api/controllers', function(req, res) {
			res.send(hub.clients.listControllers());
		});
		
		app.get('/api/controllers/:hub', function(req, res) {
			res.send(hub.clients.get(req.params.hub).toJSON());
		});
		
		app.get('/api/controllers/:hub/channels', function(req, res) {
			var client = hub.clients.get(req.params.hub);
			if (client) {
				client.on('gotChannels', function(channels) { res.send(channels); });
				client.getChannels();
			}
			else { res.send(client); }
		});
		
		app.get('/api/hub', function(req, res) {
			res.send(hub.data());
		});
		
		app.get('/api/hub/server', function(req, res) {
			res.send(hub.data().server);
		});
		
		app.get('/api/hub/server/channels', function(req, res) {
			res.send(hub.data().server.channels);
		});
		
		app.get('/api/hub/start', function(req, res) {
			hub.server.start(function() { res.send({ result: 'started' }); });
		});
		
	});
	
	app.listen(hub.config.json.expressPort);
});