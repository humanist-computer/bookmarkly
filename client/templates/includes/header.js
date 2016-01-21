Template.header.helpers({ 
	username: function() {
		if (Meteor.user().hasOwnProperty('username')) {
			return Meteor.user().username; 
		} else {
			return Meteor.user().emails[0].address;
		}
	}
});

Template.header.events({
	'click .js-logout': function() {
	    AccountsTemplates.logout();
	}
});