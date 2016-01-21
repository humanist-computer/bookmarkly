Template.tag.helpers({ 
	name: function() {
		return this.text; 
	},
	selected: function() {
		return this.selected; 
	}
});
Template.tag.events({ 
	// 'click .select2-selection__choice__remove': function(e) {
	// 	e.preventDefault();
	// 	console.log('remove was clicked');
	// }
});