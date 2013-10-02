var Events = require('./Events'),
		Client = require('./Client');

module.exports = Events.extend({
	
	init: function(config) {
		var self = this;
		
		this._config = config;
		this.clientList = [];
		
		this._config.on('newHub', function(hub) { self.startOne(hub); });
		
	},
	
	startAll: function() {
		var self = this;
		this._config.json.hubs.forEach(function(hub) { self.startOne(hub); })
	},
	
	startOne: function(hub) {
		var self = this;
		
		var client = new Client(this._config, hub);
		
		// client passes through 'serverData' from server
		client.on('serverData', function(serverData) {
			var alreadyConnected = false;
			self.clientList.forEach(function(c) {
				if (c.serverData.id == serverData.id) { alreadyConnected = true; }
			});
			if (alreadyConnected === true) { client.stop(); }
			else {
				self.clientList.push(client);
				client.acceptConnection();
			}
		});
		
		// client passes through 'disconnect'
		client.on('disconnect', function() {
			self.stopOne(client);
		});
		
	},
	
	stopAll: function() {
		for (var c = this.clientList.length-1; c >= 0; c--) {
			this.stopOne(this.clientList[c]);
		}
	},
	
	// stop a single client
	stopOne: function(client) {
		for (var c = this.clientList.length-1; c >= 0; c--) {
			if (this.clientList[c].id === client.id) {
				this.clientList.splice(c, 1);
				client.stop();
			}
		}
	},
	
	// return either the client list or a single client if an ID is provided
	clients: function(id) {
		if (id) {
			var client = false;
			this.clientList.forEach(function(c) { if (c.id == id) { client = c; } });
			return client;
		}
		return this.clientList;
	}
	
});