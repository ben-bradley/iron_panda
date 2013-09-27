/*
* Parent class for server channels.
*/

var Events = require('./Events');

var ServerChannel = Events.extend({
	
	init: function(server, channel) {
		var self = this;
		this._config = server._config; // cache the config
		this.channelId = server.id+channel; // create the channel ID for clients to consume
		this.clientsConnected = []; // hold a list of client IPs
		
		// set up the initial channel listener
		this.io = server.io.of(channel);
		this.io.on('connection', function(socket) { self.connection(socket); }); // handle the client connections
	},
	
	// handle new connections
	connection: function(socket) {
		var self = this,
				remoteIp = socket.handshake.address.address;
		
		// increment the clientsConnected counter
		this.clientsConnected.push(remoteIp);
		
		// handle when the client disconnects
		socket.on('disconnect', function() {
			var i = self.clientsConnected.indexOf(remoteIp);
			if (i > -1) { self.clientsConnected.splice(i, 1); }
		});
		
		// send the client the channelId so it can detect duplicate connections
		socket.emit('connected', this.channelId);
		
		// handle when the client accepts the connection
		socket.on('connected', function() { self.connected(socket); })
		
	},
	
	// handle when the client accepts the connection
	connected: function(socket) {
		console.log('client sent "connected"');
	},
	
	toJSON: function(json) {
		json = (json) ? json : {};
		json.channelId = this.channelId;
		json.clientsConnected = this.clientsConnected;
		return json;
	}
	
});

module.exports = ServerChannel;