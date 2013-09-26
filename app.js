// DEFINE CLASSES
var Config = require('./classes/Config'),
		Server = require('./classes/Server'),
		Clients = require('./classes/Clients');

var config = new Config(),  // KICK THIS PIG!!!
		server = {},
		clients = {},
		connectedChannelIds = {};

config.on('init', function() {
	
	// config is ready, start the server
	server = new Server(config.json);
	clients = new Clients(config.json);
	
	// the server is listening
	server.on('started', function() {
	
		// handle when the control channel gets config from a client
		server.channels.control.on('gotSync', function(remoteConfig) {
			config.sync(remoteConfig);
		});
		
		// server is started, connect to the hubs
		clients.addAll();
	});
	
	// when a client emits a 'gotSync', send the remoteConfig to the config class for processing
	clients.on('gotSync', function(remoteConfig) {
		config.sync(remoteConfig);
	});
	
	// start the server
	server.start();
});

// when a sync event finds a new hub, connect to it
config.on('newHub', function(hub) {
	clients.addOne(hub)
});