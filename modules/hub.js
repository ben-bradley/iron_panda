var events = require('events'),
		fs = require('fs'),
		io = {
			server: require('socket.io'),
			client: require('socket.io-client')
		};

// The hub is where all the socket IO stuff happens
var Hub = function(config) {
	
	this._config = config;
	
	// run once at startup
	this.init = function() {
		this._network = {
			_connectedPeers: 0
		};
		this.startHub();
	};
	
	// start the hub & open the channels found in the /channels directory
	this.startHub = function() {
		var self = this;
		this.server = io.server.listen(this._config._json.ioPort); // start the io server
		this.server.channels = {};
		fs.readdir(__dirname+'/../channels', function(err, files) {
			files.forEach(function(file) {
				var channel = require(__dirname+'/../channels/'+file);
				self.server.channels[channel.name] = self.server.of('/'+channel.name);
				channel.events.forEach(function(ev) {
					self.server.channels[channel.name].on(ev.trigger, function(socket) { ev.callback(socket, self); });
				});
			});
			self.emit('started');
		});
	};
	
	// iterate through the hubs & try to connect
	this.joinNetwork = function() {
		var self = this;
		this.clients = {};
		this._config._json.hubs.forEach(function(hub) { self.connectToAdmin(hub); });
	};
	
	this.connectToAdmin = function(hub) {
		var self = this;
		this.clients[hub] = { admin: io.client.connect('http://'+hub+'/admin') };
		this.clients[hub].admin.on('connected', function() {
			if (hub == 'localhost:'+self._config._json.ioPort) {
				// console.log('connected to LOCAL hub');
				self.clients[hub].admin.emit('localConnected');
			}
			else {
				// console.log('connected to remote hub');
				self.clients[hub].admin.on('hubsList', function(hubs) {
					console.log('GOT HUBS');
					console.log(hubs);
				});
				self.clients[hub].admin.emit('remoteConnected', self._config._json.ioPort);
			}
		});
	};
	
	return this;
};

Hub.prototype = new events.EventEmitter;

module.exports = Hub;