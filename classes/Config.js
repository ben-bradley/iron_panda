/*
Methods:
	read() = Reads the config.json file into memory.  Emits 'ready'.
	save() = Saves the _json in memory to config.json.  Emits 'saved'.
	sync() = Synchronizes the remote config acquired from another hub.

Events:
	ready = When the config is read from disk into memory.
	saved = When the config is saved from memory to disk.
	newHub = When the sync() fn detects a hub in the remote config that is not in the local list.
	synced = When the sync() fn is done.
*/
var Events = require('./Events'),
		fs = require('fs');

var Config = Events.extend({
	
	init: function(options){
		var self = this;
		options = (options || {});
		this.configFilePath = (options.configFilePath || __dirname+'/../appConfig.json');
		this.read(function() { self.emit('init'); });
	},
	
	read: function(callback) {
		var self = this;
		fs.readFile(this.configFilePath, function(err, json) {
			self.json = JSON.parse(json.toString());
			// hard wire localhost to the hubs list
			self.json.hubs.unshift({ socketio: '127.0.0.1:'+self.json.ioPort, express: '127.0.0.1:'+self.json.expressPort });
			self.emit('ready');
			if (callback) { callback(); }
		});
	},
	
	save: function() {
		var json = JSON.stringify(this.json, null, 2);
		fs.writeFile(this.configFilePath, json, function() { self.emit('saved', json); });
	},
	
	sync: function(remoteConfig) {
		var self = this;
		// if the IP of the remote and the ioPort are present, try to connect to them as well
		if (remoteConfig.ip && remoteConfig.ioPort) {
			remoteConfig.hubs.push({
				socketio: remoteConfig.ip+':'+remoteConfig.ioPort,
				express: remoteConfig.ip+':'+remoteConfig.expressPort
			});
		}
		// iterate through each of the remote hubs
		remoteConfig.hubs.forEach(function(remoteHub) {
			var newHub = true; // new by default
			// iterate through the local hubs
			self.json.hubs.forEach(function(localHub) {
				if (localHub.socketio == remoteHub.socketio) { newHub = false; } // we've already got this one
			})
			if (newHub) { // new hub!!!
				self.emit('newHub', remoteHub); // trigger the event that will initiate a new connection
				self.json.hubs.push(remoteHub);
			}
		});
		this.emit('synced');
	}
	
});

module.exports = Config;