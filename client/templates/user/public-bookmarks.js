// Assign dummy bookmarks to bookmarks in the bookmarks tmpl, via helper
Template.publicBookmarks.helpers({
    bookmarks: function() {
        var bookmarks = Bookmarks.find({
        	userId: this._id
        },{sort: {submitted: -1}});

        // return Bookmarks.find({}, {sort: {submitted: -1}}); 
        
        console.log(bookmarks);
        
        if (bookmarks.fetch().length > 0) {
        	return bookmarks;
        } else {
        	return '';
        } 
    },
    username: function() {
        if (this.username) {
            return this.username; 
        } else {
            return this.emails[0].address;
        }
    },
    bio: function() {
        if (this.profile) {
            return this.profile.bio; 
        } else {
            return '';
        }
    },
    hasBookmarks: function() {
        var bookmarks = Bookmarks
            .find(
                {
                    "private": false,
                    "userId": this._id
                }, 
                {sort: {submitted: -1}}).fetch(),
            
            numberOfBookmarks = bookmarks.length; 

            console.log("NUM!", numberOfBookmarks, this);

        if (numberOfBookmarks <= 0) {
            return false;
        } else {
            return true;
        }
    }
});
