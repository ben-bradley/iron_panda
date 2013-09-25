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
		this.hubUrl = (this.hub && this.channel) ? 'http://'+this.hub+'/'+this.channel : false;
		if (this.hubUrl) { this._connect(); }
		else { console.log('cannot connect to: http://'+this.hubUrl); }
	},
	
	// shut down this client
	close: function() {
		this.io.disconnect();
		this.emit('closed', this.id);
		delete this;
	},
	
	// private fn to initiate a connection
	_connect: function() {
		var self = this;
		this.io = ioClient.connect(this.hubUrl);
		// handle the returned channelId
		this.io.on('connected', function(channelId) {
			self.channelId = channelId;
			self.emit('gotChannelId'); // handle the channelId at the collection to sort out duplicates
		});
	}
	
});
