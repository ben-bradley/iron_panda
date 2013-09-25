/*
* Configurations for the control channel on the Server!
*/

var ServerChannel = require('./ServerChannel');

module.exports = ServerChannel.extend({
	
	init: function(server) {
		// insert the control channel
		this._super(server, '/control');
	},
	
	// respond to 'connected' events on the control channel (listener set in ServerChannel.js)
	connected: function(socket) {
		
		// send the client the config data for this server
		socket.emit('sync', this.config);
		
		// pass the socket back to the ServerChannel.js-connected();
		this._super(socket);
	}
	
	
});