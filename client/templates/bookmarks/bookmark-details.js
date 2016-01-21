Template.bookmarkDetails.helpers({ 
	comments: function() {
		return Comments.find({ bookmarkId: this._id }); 
	}
});
Template.bookmarkDetails.onRendered(function() {
    $('.tooltipped').tooltip({delay: 0});
});
Template.bookmarkDetails.events({
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