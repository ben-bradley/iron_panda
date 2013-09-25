/*
* This is similar to a Collection in Backbone
* It should listen to events that affect all clients and make it easy to select a particular client;
*/

var Events = require('./Events'),
		ClientControl = require('./ClientControl'),
		ClientEvent = require('./ClientEvent');

module.exports = Events.extend({
	
	init: function(config) {
		this.models = {};
		this.channelIds = {};
		this._config = config;
	},
	
	addAll: function() {
		var self = this;
		this._config.hubs.forEach(function(hub) { self.addOne(hub); })
	},
	
	// Connect to a new hub's control channel
	addOne: function(hub) {
		var client = new ClientControl(hub, this._config),
				self = this;
		
		// handle new channel IDs (connect or close based on duplicate IDs)
		client.on('gotChannelId', function() {
			if (self.channelIds[client.channelId]) { client.close(); } // this one is already open
			else {
				self.channelIds[client.channelId] = true; // add this channel ID to the list
				self.models[client.id] = client; // add this client to the models object
				client.io.emit('connected'); // inform the server that we've accepted this connection
				client.emit('connected'); // inform the app that we've connected
			}
		});
		
		// clean up the models list on client.close()
		client.on('closed', function() { self.remove(client); });
		
		// pass through the 'gotSync' event so that the Config can handle it
		client.on('gotSync', function(remoteConfig) { self.emit('gotSync', remoteConfig); });
		
	},
	
	// Remove the client from the lists
	remove: function(client) {
		delete this.channelIds[client.channelId];
		delete this.models[client.id];
	}
	
});