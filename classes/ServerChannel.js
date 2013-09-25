/*
* Parent class for server channels.
*/

var Events = require('./Events');

var ServerChannel = Events.extend({
	
	init: function(server, channel) {
		var self = this;
		this.config = server.config; // cache the config
		this.channelId = server.id+channel; // create the channel ID for clients to consume
		
		// set up the initial channel listener
		this.io = server.io.of(channel);
		this.io.on('connection', function(socket) { self.connection(socket); }); // handle the client connections
	},
	
	// handle new connections
	connection: function(socket) {
		var self = this;
		
		// send the client the channelId so it can detect duplicate connections
		socket.emit('connected', this.channelId);
		
		// handle when the client accepts the connection
		socket.on('connected', function() { self.connected(socket); })
		
	},
	
	// handle when the client accepts the connection
	connected: function(socket) {
		console.log('client sent "connected"');
	}
	
});

module.exports = ServerChannel;