/*
* These are specific functions for the control channel client
*/

var Client = require('./Client');

module.exports = Client.extend({
	
	// inject the 'control' channel and pass through to Client.js.init()
	init: function(hub, config) {
		var self = this;
		this._config = config;
		this.on('connected', function() { self.connected(); });
		this._super(hub, 'control');
	},
	
	// set io event message handlers here
	connected: function(channelId) {
		var self = this;
		
		// pass through when we get sync data from the server
		this.io.on('sync', function(remoteConfig) { self.emit('gotSync', remoteConfig); });
		
		// send local config data to the server
		this.io.emit('sync', this._config);
		
	},
	
	getChannels: function(callback) {
		var self = this;
		// listen for the IO event and pass it through to the object
		this.io.once('gotChannels', function(channels) { self.emit('gotChannels', channels); });
		this.io.emit('getChannels');
	},
	
	toJSON: function() {
		return {
			id: this.id,
			hub: this.hub,
			channel: this.channel,
			hubUrl: this.hubUrl
		};
	}
	
});