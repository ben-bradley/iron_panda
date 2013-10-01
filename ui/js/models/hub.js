define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	var HubModel = Backbone.Model.extend({
		url: 'api/hub',
		
		startHub: function() {
			var model = this;
			$.get('api/hub/start', function(res) {
				console.log(res);
				model.fetch();
			});
		},
		
		stopHub: function() {
			var model = this;
			$.get('api/hub/stop', function(res) {
				console.log(res);
				model.fetch();
			});
		}
		
	});
	return HubModel;
});