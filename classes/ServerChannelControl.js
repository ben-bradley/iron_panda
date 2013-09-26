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
		var self = this,
				remoteIp = socket.handshake.address.address;
		
		// send the client the config data for this server
		socket.emit('sync', this.config);
		
		// handle sync data from the client
		socket.on('sync', function(remoteConfig) {
			remoteConfig.ip = remoteIp;
			self.emit('gotSync', remoteConfig);
		});
		
		// pass the socket back to the ServerChannel.js-connected();
		this._super(socket);
	}
	
	
});