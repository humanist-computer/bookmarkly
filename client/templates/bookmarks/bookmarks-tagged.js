// Assign dummy bookmarks to bookmarks in the bookmarks tmpl, via helper
Template.bookmarksTagged.helpers({
    bookmarks: function() {
        return this.bookmarks; 
    },
    tag: function() {
        return this.tag; 
    },
    hasBookmarks: function() {
        if (this.bookmarks.fetch().length <= 0) {
        	return false;
        } else {
        	return true;
        }
    }
});
Template.bookmarksTagged.onRendered(function() {
    $('.tooltipped').tooltip({delay: 0});
    updateInputState('.js-search-by-tag-input-field');
    console.log(updateInputState);
});
Template.bookmarksTagged.events({
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
	}
});