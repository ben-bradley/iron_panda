/*
* The base server class.  It's like a collection for ServerChannels
*/

var Events = require('./Events'),
		ServerChannelEvent = require('./ServerChannelEvent'),
		ServerChannelControl = require('./ServerChannelControl'),
		io = require('socket.io');

var Server = Events.extend({
	
	init: function(config) {
		this._config = config;
		this.id = new Date().getTime();
		this.started = false;
	},
	
	start: function(callback) {
		var self = this;
		
		// start the server
		this.io = io.listen(this._config.ioPort);
		
		// set the authorization
		this.io.configure(function() {
			self.io.set('authorization', function(handshakeData, callback) {
				if (handshakeData.query.secret == self._config.secret) { callback(null, true); }
				else { callback(null, false); }
			});
		});
		
		// open the channels
		this.channels = {
			control: new ServerChannelControl(this),
			event: new ServerChannelEvent(this)
		};
		
		// emit the started event
		this.emit('started');
		this.started = true;
		if (callback) { callback(); }
	}
	
});

module.exports = Server;