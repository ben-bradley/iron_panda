define([
	'jquery',
	'underscore',
	'backbone',
	'views/navbar',
	'views/splash'
], function($, _, Backbone, NavbarView, SplashView) {
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
				navbarView = new NavbarView();
		
		app_router.on('route:defaultRoute', function(actions){
			// show splash
			var splashView = new SplashView();
			splashView.render();
		});
		
		// trigger by default to build the page framework
		navbarView.render();
		
		Backbone.history.start();
	};
	
	return {
		initialize: initialize
	};
	
});