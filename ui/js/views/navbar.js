define([
	'jquery',
	'underscore',
	'backbone',
	'text!/templates/navbar.html'
], function($, _, Backbone, navbarTemplate){
	var NavbarView = Backbone.View.extend({
		el: $('#navbar'),
		initialize: function() {
			this.model.on('sync', this.render, this);
			this.model.fetch();
		},
		render: function(){
			console.log(this.model.toJSON());
			var compiledNavbar = _.template(navbarTemplate, this.model.toJSON());
			this.model.on('change:started', this.toggleStartStop, this);
			this.$el.html(compiledNavbar);
		},
		events: {
			'click #startHub, #stopHub':	'toggleStartStop'
		},
		toggleStartStop: function(ev) {
			var startStop = $(ev.currentTarget).attr('id');
			if (!startStop) { return false; }
			console.log(startStop);
			this.model[startStop]();
		}
		
	});
	
	return NavbarView;
});