require.config({
	paths: {
		jquery: 'libs/jquery',
		underscore: 'libs/underscore',
		backbone: 'libs/backbone',
		bootstrap: 'libs/bootstrap'
	}
});

require([
	'app'
], function(App) {
	App.initialize();
});