define([
	'jquery',
	'underscore',
	'backbone',
	'text!/templates/navbar.html'
], function($, _, Backbone, navbarTemplate){
	var NavbarView = Backbone.View.extend({
		el: $('#navbar'),
		render: function(){
			var data = {},
					compiledNavbar = _.template(navbarTemplate, data);
			this.$el.html(compiledNavbar);
		}
	});
	
	return NavbarView;
});