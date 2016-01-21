Template.profile.created = function() { 

}

Template.profile.helpers({ 
    username: function() {
        if (this.hasOwnProperty('username')) {
            return this.username;
        } else {
            return ''
        }
    },
    email: function() {
        console.log(this);
        return this.emails[0].address;
    },
    bio: function() {
        console.log(this);
        return this.profile.bio;
    },
    errorMessage: function(field) {
        // return Session.get('bookmarkEditErrors')[field]; 
    },
    errorClass: function (field) {
        //return !!Session.get('bookmarkEditErrors')[field] ? 'has-error' : '';
    }
});

Template.profile.events({ 
    'submit form': function(e) {
        e.preventDefault();

        var usernameInput = $('.js-username')[0],
            emailInput    = $('.js-email')[0],
            bioInput      = $('.js-bio')[0],
            emails = [],
            userProperties = null,
            userId = this._id;

        emails[0] = { address: $(emailInput).val() },

            // userProperties = {
            //     username: $(usernameInput).val(), 
            //     emails: emails
            // };
        userProperties = {
            profile: {
                bio: $(bioInput).val()
            }
        },

        console.log(userProperties, this);

        Meteor.users.update(userId, {
                $set: userProperties
            }, function(error) { 
                if (error) {
                    console.log(error.reason);
                    // display the error to the user
                    throwError(error.reason);
                } else {
                    Session.set('userUpdatedSuccess', true);
                    Router.go('bookmarks');
                }
            }
        ); 
    }, 
    'click .js-delete': function(e) {
        e.preventDefault();
        if (confirm("Delete yourself?")) { 
            var userId = this._id; 
            console.log(userId);
            Meteor.users.remove(userId);          
        } 
    }
});

Template.profile.rendered = function() { 

}
