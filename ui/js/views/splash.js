define([
	'jquery',
	'underscore',
	'backbone',
	'text!/templates/splash.html'
], function($, _, Backbone, splashTemplate){
	var SplashView = Backbone.View.extend({
		el: function() { return $('#content'); },
		render: function(){
			var data = {},
					compiledSplash = _.template(splashTemplate, data);
			this.$el.append(compiledSplash);
		}
	});
	
	return SplashView;
});