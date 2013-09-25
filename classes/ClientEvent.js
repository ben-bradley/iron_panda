var Client = require('./Client');

module.exports = Client.extend({
	init: function(options) {
		options.channel = 'event';
		this._super(options);
	},
	connect: function() {
		this._super();
	}
});