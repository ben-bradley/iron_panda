var Events = require('./Events');

var Hub = Events.extend({
	
	init: function() {
		var Config = require('./Config'),
				Server = require('./Server'),
				Clients = require('./Clients'),
				self = this;
		
		this.config = new Config(); // KICK THIS PIG!!!
		this.server = {};
		this.clients = {};
		
		this.config.on('init', function() {
			
			// config is ready, start the server
			self.server = new Server(self.config.json);
			self.clients = new Clients(self.config.json);
			
			// the server is listening
			self.server.on('started', function() {
			
				// handle when the control channel gets config from a client
				self.server.channels.control.on('gotSync', function(remoteConfig) {
					self.config.sync(remoteConfig);
				});
				
				// server is started, connect to the hubs
				self.clients.addAll();
				
				self.emit('init'); // hub.inited!
			});
			
			// when a client emits a 'gotSync', send the remoteConfig to the config class for processing
			self.clients.on('gotSync', function(remoteConfig) {
				self.config.sync(remoteConfig);
			});
			
			// start the server
			self.server.start();
		});
		
		// when a sync event finds a new hub, connect to it
		this.config.on('newHub', function(hub) {
			self.clients.addOne(hub)
		});
	}
	
});

module.exports = Hub;
