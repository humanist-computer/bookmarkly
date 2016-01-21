Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	waitOn: function() { 
		return Meteor.subscribe('bookmarks'); 
	}
});

Router.route('/', {

	name: 'bookmarks',
	onAfterAction: function () {
		console.log(Meteor.user());
	    if (Session.equals('bookmarkDeletedSuccess', true)) {
	        sAlert.success('Bookmark successfully deleted!');
	        Session.set('bookmarkDeletedSuccess', false);
	    }
	    if (Session.equals('bookmarkDeletedSuccess', true)) {
	        sAlert.success('Bookmark successfully deleted!');
	        Session.set('bookmarkDeletedSuccess', false);
	    }
	}
});

Router.route('/bookmarks/:_id', {
	name: 'bookmarkDetails',
	waitOn: function() {
		return Meteor.subscribe('comments', this.params._id); 
	},
	data: function() { 
		//sAlert.success('Bookmark created.');
		return Bookmarks.findOne(this.params._id); 
	},
	onAfterAction: function () {
	    if (Session.equals('bookmarkSaveSuccess', true)) {
	        sAlert.success('Bookmark successfully created!');
	        Session.set('bookmarkSaveSuccess', false);
	    }
	    if (Session.equals('bookmarkUpdatedSuccess', true)) {
	        sAlert.success('Bookmark successfully updated!');
	        Session.set('bookmarkUpdatedSuccess', false);
	    }
	   	if (Session.equals('bookmarkDuplicate', true)) {
	        sAlert.error('Looks like you\'ve already saved this URL.');
	        Session.set('bookmarkDuplicate', false);
	    }
	},
});

Router.route('/bookmarks/:_id/edit', {
	name: 'bookmarkEdit',
	data: function() { 
		return Bookmarks.findOne(this.params._id); 
	}
});

Router.route('/tagged/:_tag', {
	name: 'bookmarksTagged',
	
	data: function() { 
		
		var data = {},
			tag = this.params._tag;

		data.bookmarks = Bookmarks.find({ 
			tags: { 
				$elemMatch: {
            		text: tag
        		}
        	}
		});

		data.tag = tag;

		return data; 
	}
});

Router.route('/new', {
	name: 'bookmarkSubmit'
});

Router.route('/user/:username', {
	name: 'publicBookmarks',
	waitOn: function() {
	    return [Meteor.subscribe('userList'), Meteor.subscribe('publicBookmarks')];
	},
	data: function() { 
		var user = Meteor.users.findOne({
			username: this.params.username
		});  

		if (! user) {
			if (Meteor.loggingIn()) { 
				this.render(this.loadingTemplate);
			} else { 
				console.log('not');
				this.render('notFound');
			}
		} else {
			return user;
		}
	}
});

Router.route('/profile', {
	name: 'profile',
	waitOn: function() {
	    return [Meteor.subscribe('userList'), Meteor.subscribe('publicBookmarks')];
	},
	data: function() { 
		var user = Meteor.user();  

		if (! user) {
			if (Meteor.loggingIn()) { 
				this.render(this.loadingTemplate);
			} else { 
				console.log('not');
				this.render('notFound');
			}
		} else {
			return user;
		}
	}
});

var requireLogin = function() { 
	if (! Meteor.user()) {
		if (Meteor.loggingIn()) { 
			this.render(this.loadingTemplate);
		} else { 
			this.render('accessDenied');
		}
	} else {
		this.next(); 
	}
}

var showSplash = function() { 
	if (! Meteor.user()) {
		if (Meteor.loggingIn()) { 
			this.render(this.loadingTemplate);
		} else { 
			// sAlert.success('You have successfully signed out.');
			this.render('splash');
		}
	} else {
		this.next(); 
	}
}

Router.onBeforeAction(showSplash, {
	only: ['bookmarks']
});

Router.onBeforeAction('dataNotFound', {
	only: 'bookmark'
});

Router.onBeforeAction(requireLogin, {
	only: ['bookmarkSubmit']
});

// Options
AccountsTemplates.configure({
    //defaultLayout: 'emptyLayout',
    showForgotPasswordLink: true,
    overrideLoginErrors: true,
    enablePasswordChange: true,
    sendVerificationEmail: false,

    //enforceEmailVerification: true,
    //confirmPassword: true,
    //continuousValidation: false,
    //displayFormLabels: true,
    //forbidClientAccountCreation: false,
    //formValidationFeedback: true,
    //homeRoutePath: '/',
    //showAddRemoveServices: false,
    //showPlaceholders: true,

    negativeValidation: true,
    positiveValidation:true,
    negativeFeedback: false,
    positiveFeedback:true,

    // Privacy Policy and Terms of Use
    //privacyUrl: 'privacy',
    //termsUrl: 'terms-of-use',
});

//Routes
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');

