// Assign dummy bookmarks to bookmarks in the bookmarks tmpl, via helper
Template.bookmarks.helpers({
    bookmarks: function() {
        return Bookmarks.find({}, {sort: {submitted: -1}}); 
    },
    hasBookmarks: function() {
        var bookmarks = Bookmarks
        	.find({}, {sort: {submitted: -1}}).fetch(),
        	
        	numberOfBookmarks = bookmarks.length; 

        if (numberOfBookmarks <= 0) {
        	return false;
        } else {
        	return true;
        }
    }
});

Template.bookmarks.onRendered(function() {
    $('.tooltipped').tooltip({delay: 0});
    console.log('This is called');
    $(".dropdown-button").dropdown();
});

Template.bookmarks.events({
	'keyup .js-search-by-tag-input-field': function(e) {

	    if (e.keyCode == 13) {
	    	var input = $('.js-search-by-tag-input-field'),
	    		tag = $(input).val();

	    	if (tag == '') {
	    		Router.go('bookmarks');
	    	} else {
	    		Router.go('bookmarksTagged', {_tag: tag});
	    	}
	    }
	},
    'click .js-tag-chip': function(e) {
        console.log(e);
        var tag = this.text;
        //return Bookmarks.find({}, {sort: {submitted: -1}}); 
        Bookmarks.find({ 
            tags: { 
                $elemMatch: {
                    text: tag
                }
            }
        });
    }
});