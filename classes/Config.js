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

module.exports = Events.extend({
	
	init: function(options){
		var self = this;
		options = (options || {});
		this.id = new Date().getTime();
		this.configFilePath = (options.configFilePath || __dirname+'/../appConfig.json');
	},
	
	read: function() {
		var self = this;
		fs.readFile(this.configFilePath, function(err, json) {
			self.json = JSON.parse(json.toString());
			// hard wire localhost to the hubs list
			self.json.hubs.unshift({ socketio: '127.0.0.1:'+self.json.ioPort, express: '127.0.0.1:'+self.json.expressPort });
			self.emit('ready');
		});
	},
	
	save: function() {
		var json = JSON.stringify(this.json, null, 2);
		fs.writeFile(this.configFilePath, json, function() { self.emit('saved', json); });
	},
	
	syncHubs: function(remotehubs) {
		var localhubs = this.json.hubs,
				self = this;
		remotehubs.forEach(function(rhub) {
			var newhub = true;
			localhubs.forEach(function(lhub) { if (lhub.socketio == rhub.socketio) { newhub = false; } });
			if (newhub == true) { self.emit('newHub', rhub); }
		});
	},
	
	removeHub: function(hub) {
		for (var h = this.json.hubs.length-1; h >= 0; h--) {
			if (this.json.hubs[h].socketio == hub.socktio) {
				this.json.hubs.splice(h, 1);
			}
		}
	}
	
});
