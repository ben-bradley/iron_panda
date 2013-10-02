var Events = require('./Events'),
		Server = require('./Server'),
		Controllers = require('./Controllers');

module.exports = Events.extend({
	
	init: function(config) {
		var self = this;
		
		this._config = config;
		this.started = false;
		
		// config is ready, start the server
		this.server = new Server(this._config);
		this.controllers = new Controllers(this._config);
		
		// the server is started
		this.server.on('started', function() {
			self.controllers.startAll();
			self.started = true;
			self.emit('started');
		});
		
		// the server is stopped
		this.server.on('stopped', function() {
			self.controllers.stopAll();
			self.started = false;
			self.emit('stopped');
		});
		
		// a client connected, try connecting back to it
		this.server.on('clientConnected', function(clientHub) {
			self.controllers.startOne(clientHub);
		});
		
		this.emit('init'); // hub.inited!
	},
	
	start: function() { this.server.start(); },
	
	stop: function() { this.server.stop(); }
	
});