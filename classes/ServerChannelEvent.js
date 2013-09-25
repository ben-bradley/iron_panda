var ServerChannel = require('./ServerChannel');

module.exports = ServerChannel.extend({
	init: function(server) {
		this._super(server, '/event');
	}
});