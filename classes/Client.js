var Events = require('./Events'),
		ioClient = require('socket.io-client');

module.exports = Events.extend({
	
	init: function(config, hub) {
		var self = this;
		
		this._config = config;
		this.io = ioClient.connect(hub.socketio, { query: 'secret='+this._config.json.secret });
		
		this.io.on('connected', function(data) {
			self.serverData = data;
			self.emit('gotServerId', data.id);
		});
		
	},
	
	connected: function() {
		
		// sync hubs from server
		this._config.syncHubs(this.serverData.hubs);
		
		// sync hubs TO server
		this.io.emit('connected', {
			id: this._config.id,
			hubs: this._config.json.hubs,
			ioPort: this._config.json.ioPort,
			expressPort: this._config.json.expressPort
		});
		
		// join the control room
		this.io.emit('join', { rooms: [ 'control' ] });
		
		// set the connection data
		this.serverId = this.serverData.id;
		this.serverAddress = this.io.socket.options.host;
		
	},
	
	disconnect: function() {
		this.io.disconnect();
	},
	
	toJSON: function(callback) {
		var json = {
			serverId: this.serverId,
			serverAddress: this.serverAddress,
			open: this.io.socket.open,
			connected: this.io.socket.connected,
			sessionid: this.io.socket.sessionid
		};
		if (callback) { callback(json); }
		else { return json; }
	},
	
	getRooms: function(callback) {
		this.io.once('gotRooms', function(data) { callback(data); });
		this.io.emit('getRooms');
	}
	
});