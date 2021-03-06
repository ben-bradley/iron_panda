/*
* Parent class for all clients.
*/

var Events = require('./Events'),
		ioClient = require('socket.io-client');

module.exports = Events.extend({
	
	init: function(hub, channel) {
		this.id = new Date().getTime();
		this.hub = hub;
		this.channel = channel;
		this.hubUrl = (this.hub.socketio && this.channel) ? 'http://'+this.hub.socketio+'/'+this.channel : false;
		if (this.hubUrl) { this._connect(); }
		else { console.log('cannot connect to: http://'+this.hubUrl); }
	},
	
	// shut down this client
	close: function() {
		this.io.disconnect();
		this.emit('closed');
		delete this;
	},
	
	// private fn to initiate a connection
	_connect: function() {
		var self = this;
		// include secret for authorization
		this.io = ioClient.connect(this.hubUrl, { query: 'secret='+this._config.secret });
		// handle the returned channelId
		this.io.on('connected', function(channelId) {
			self.channelId = channelId;
			self.emit('gotChannelId'); // handle the channelId at the collection to sort out duplicates
		});
		
		this.io.on('disconnect', function() { self.emit('closed'); });
	}
	
});
