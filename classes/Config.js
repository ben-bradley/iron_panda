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
			self.json.hubs.unshift('127.0.0.1:'+self.json.ioPort); // hard wire localhost to the hubs list
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
		remoteConfig.hubs.forEach(function(hub) {
			if (self.json.hubs.indexOf(hub) == -1) { // new hub!!!
				self.emit('newHub', hub); // trigger the event that will initiate a new connection
				self.json.hubs.push(hub);
			}
		});
		this.emit('synced');
	}
	
});

module.exports = Config;