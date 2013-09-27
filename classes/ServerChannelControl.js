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
		socket.emit('sync', this._config);
		
		// handle sync data from the client
		socket.on('sync', function(remoteConfig) {
			remoteConfig.ip = remoteIp;
			self.emit('gotSync', remoteConfig); // send the sync event to the local hub
		});
		
		socket.on('getChannels', function() {
			var json = self.toJSON();
			/*
				THIS NEEDS SOME LOVING, RIGHT NOW IT JUST SENDS BACK JSON FOR THIS CHANNEL
			*/
			socket.emit('gotChannels', json); // respond to the client with the list of local channels
		});
		
		// pass the socket back to the ServerChannel.js-connected();
		this._super(socket);
	},
	
	toJSON: function() {
		return this._super({ type: 'control' });
	}
	
	
});