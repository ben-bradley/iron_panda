var express = require('express'),
		app = express(),
		Hub = require(__dirname+'/classes/Hub');

var hub = new Hub();

hub.on('init', function() {
	app.configure(function() {
		
		// app configs
		app.use(express.bodyParser()); // handle POST/PUT
		app.use(express.cookieParser()); // enable sessions
		app.use(express.session({ secret: 'blargh' })); // configure sessions
	//	app.use(express.logger({ stream: accessLog }));
		
		app.use('/', express.static(__dirname+'/ui'));
		
		app.get('/api/hubs', function(req, res) {
			res.send(hub.config.json.hubs);
		});
		
	});
	
	app.listen(hub.config.json.expressPort);
});