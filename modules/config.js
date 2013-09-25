/************************
Description: This module is responsible for interacting with the application config.

Methods:
	add(key, value) = Creates or pushes new config attributes
	remove(key, value) = Removes a value from an array or deletes it form the config
	read() = Reads the config.json file into memory.  Emits 'ready'.
	save() = Saves the _json in memory to config.json.  Emits 'saved'.

Events:
	init = Triggered when class is loaded & config is read for the first time.
	ready = Triggered when the config is read from disk into memory.
	saved = Triggered when the config is saved from memory to disk.

************************/

var fs = require('fs'),
		events = require('events');

var Config = function() {
	var self = this;
	
	// do once on load
	this.init = function() {
		this.read(function() { self.emit('init'); });
	};
	
	// create or push 
	this.add = function(key, value) {
		if (Array.isArray(self._json[key])) { self._json[key].push(value); }
		else { self._json[key] = value; }
		return this;
	};
	
	// splice an array or delete an attribute
	this.remove = function(key, value) {
		// remove a specific value
		if (self._json[key] && value) {
			if (Array.isArray(self._json[key])) {
				for (var i = self._json[key].length -1; i >= 0; i--) {
					if (self._json[key][i] == value) { self._json[key].splice(i, 1); }
				} 
			}
			else if (self._json[key] && self._json[key] == value) {
				delete self._json[key];
			}
		}
		return this;
	};
	
	// Read the config file from disk to memory
	this.read = function(callback) {
		fs.readFile(__dirname+'/../appConfig.json', function(err, json) {
			self._json = JSON.parse(json.toString());
			self._json.hubs.unshift('localhost:'+self._json.ioPort); // hard wire localhost to the hubs list
			self.emit('ready');
			if (callback) { callback(); }
		});
	};
	
	// save the config data from memory to disk
	this.save = function() {
		var json = JSON.stringify(this._json, null, 2);
		fs.writeFile(__dirname+'/../appConfig.json', json, function() {
			self.emit('saved', json);
			self.read();
		});
	};
	
	// init by default
	this.init();
	
	return this;
}

Config.prototype = new events.EventEmitter;

module.exports = Config;