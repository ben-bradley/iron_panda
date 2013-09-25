// DEFINE CLASSES
var Config = require('./classes/Config'),
		Server = require('./classes/Server'),
		Clients = require('./classes/Clients'),
		ClientControl = require('./classes/ClientControl');

var config = new Config(),  // KICK THIS PIG!!!
		server = {},
		clients = new Clients(),
		connectedChannelIds = {};

config.on('init', function() {
	// config is ready, start the server
	server = new Server(config.json);
	
	server.on('started', function() {
		// server is started, connect to the hubs
		config.json.hubs.forEach(function(hub) { clients.add(hub); });
	});
	
	// start the server
	server.start();
});

config.on('newHub', function(hub) {
	clients.add(hub)
});

clients.on('gotSync', function(remoteConfig) {
	config.sync(remoteConfig);
});