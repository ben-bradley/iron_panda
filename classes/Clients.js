/*
* This is similar to a Collection in Backbone
* It should listen to events that affect all clients and make it easy to select a particular client;
*/

var Events = require('./Events'),
		ClientControl = require('./ClientControl'),
		ClientEvent = require('./ClientEvent');

module.exports = Events.extend({
	
	init: function(config) {
		this.controlClients = {};
		this.channelIds = {};
		this._config = config;
	},
	
	addAll: function() {
		var self = this;
		this._config.hubs.forEach(function(hub) { self.addOne(hub); })
	},
	
	// Connect to a new hub's control channel
	addOne: function(hub) {
		var controlClient = new ClientControl(hub, this._config),
				self = this;
		
		// handle new channel IDs (connect or close based on duplicate IDs)
		controlClient.on('gotChannelId', function() {
			if (self.channelIds[controlClient.channelId]) { controlClient.close(); } // this one is already open
			else {
				self.channelIds[controlClient.channelId] = true; // add this channel ID to the list
				self.controlClients[controlClient.id] = controlClient; // add this client to the controlClients object
				controlClient.io.emit('connected'); // inform the server that we've accepted this connection
				controlClient.emit('connected'); // inform the app that we've connected
			}
		});
		
		// clean up the controlClients list on client.close()
		controlClient.on('closed', function() { self.remove(controlClient); });
		
		// pass through the 'gotSync' event so that the Config can handle it
		controlClient.on('gotSync', function(remoteConfig) { self.emit('gotSync', remoteConfig); });
		
	},
	
	listControllers: function() {
		var controllers = [];
		for (var c in this.controlClients) {
			var client = this.controlClients[c];
			if (client.channel == 'control') {
				controllers.push(client.toJSON());
			}
		}
		return controllers;
	},
	
	get: function(id) {
		return this.controlClients[id];
	},
	
	// Remove the client from the lists
	remove: function(client) {
		delete this.channelIds[client.channelId];
		delete this.controlClients[client.id];
	}
	
});