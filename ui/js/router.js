define([
	'jquery',
	'underscore',
	'backbone',
	'views/navbar',
	'views/splash',
	'models/hub'
], function($, _, Backbone, NavbarView, SplashView, HubModel) {
	var AppRouter = Backbone.Router.extend({
		routes: {
			// Define some URL routes
//      '/projects': 'showProjects',
//      '/users': 'showUsers',

			// Default
			'*actions': 'defaultRoute'
		}
	});

	var initialize = function(){
		var app_router = new AppRouter,
				hubModel = new HubModel(),
				navbarView = new NavbarView({ model: hubModel });
		
		app_router.on('route:defaultRoute', function(actions){
			// show splash
			var splashView = new SplashView();
			splashView.render();
		});
		
		Backbone.history.start();
	};
	
	return {
		initialize: initialize
	};
	
});