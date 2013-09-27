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
			});
			
			// when a client emits a 'gotSync', send the remoteConfig to the config class for processing
			self.clients.on('gotSync', function(remoteConfig) {
				self.config.sync(remoteConfig);
			});
			
			
			self.emit('init'); // hub.inited!
			
			
			// start the server
			// this turned off so that the GUI can turn the hub on/off
//			self.server.start();
		});
		
		// when a sync event finds a new hub, connect to it
		this.config.on('newHub', function(hub) {
			self.clients.addOne(hub)
		});
	},
	
	data: function() {
		var self = this;
		
		var data = {
			server: {
				id: this.server.id,
				started: this.server.started,
				channels: function() {
					var channels = [];
					for (var c in self.server.channels) {
						var channel = self.server.channels[c];
						channels.push({
							id: channel.channelId,
							name: c,
							clientsConnected: channel.clientsConnected
						});
					}
					return channels;
				}()
			}
		};
		return data;
	}
	
});

module.exports = Hub;
