var Events = require('./Events'),
		ioClient = require('socket.io-client');

module.exports = Events.extend({
	
	init: function(config, hub) {
		var self = this;
		
		this._config = config;
		this._hub = hub;
		this.id = new Date().getTime();
		
		this.io = ioClient.connect(hub.socketio, {
			query: 'secret='+this._config.json.secret,
			'force new connection': true // facepalm
		});
		
		// pass the serverData event to the controllers so it can check for duplicates
		this.io.on('serverData', function(serverData) {
			self.serverData = serverData;
			self.emit('serverData', serverData);
		});
		
		// pass the disconnect event so that the controllers can stay current
		this.io.on('disconnect', function() {
			self.emit('disconnect');
		});
		
	},
	
	// triggered by controllers when connection is NOT a dupe
	acceptConnection: function() {
		
		// sync hubs from server
		this._config.syncHubs(this.serverData.hubs);
		
		// sync hubs TO server
		this.io.emit('clientData', {
			id: this._config.id,
			hubs: this._config.json.hubs,
			ioPort: this._config.json.ioPort,
			expressPort: this._config.json.expressPort
		});
		
		// join the control room
		this.io.emit('join', { rooms: [ 'control' ] });
		
	},
	
	// triggered by controllers when disconnect occurs
	stop: function() {
		this.io.disconnect();
		this.emit('stopped');
		delete this;
	},
	
	toJSON: function(callback) {
		var json = {
			id: this.id,
			serverId: this.serverData.id,
			serverAddress: this.io.socket.options.host,
			hub: this._hub,
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