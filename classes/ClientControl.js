/*
* These are specific functions for the control channel client
*/

var Client = require('./Client');

module.exports = Client.extend({
	
	// inject the 'control' channel and pass through to Client.js.init()
	init: function(hub) {
		var self = this;
		this.on('connected', function() { self.connected(); });
		this._super(hub, 'control');
	},
	
	// set io event message handlers here
	connected: function(channelId) {
		var self = this;
		
		// pass through when we get sync data from the server
		this.io.on('sync', function(config) { self.emit('gotSync', config); });
		
	}
	
});