Bookmarks = new Mongo.Collection('bookmarks');

Bookmarks.allow({
	update: function(userId, bookmark) { 
		return ownsBookmark(userId, bookmark); 
	}, 
	remove: function(userId, bookmark) { 
		return ownsBookmark(userId, bookmark); 
	}
});

Bookmarks.deny({
	update: function(userId, bookmark, fieldNames) {
    	// may only edit the following three fields:
		return (_.without(
			fieldNames, 
			'url', 
			'title', 
			'private', 
			'tags'
		).length > 0); 
	}
});

Bookmarks.deny({
	update: function(userId, bookmark, fieldNames, modifier) {
		var errors = validateBookmark(modifier.$set);
		return errors.title || errors.url; 
	}
});

Meteor.methods({
	bookmarkSubmit: function(bookmarkAttributes) {
    	check(Meteor.userId(), String);
    	check(bookmarkAttributes, {
      		title: String,
      		url: String,
      		private: Boolean,
      		tags: Array
    	});

    	var errors = validateBookmark(bookmarkAttributes); 

    	if (errors.title || errors.url) {
    		throw new Meteor.Error('invalid-bookmark', "You must set a title and URL for your post");
    	}
    	
    	var user = Meteor.user();

    	var duplicateBookmark = Bookmarks.findOne({
    		url: bookmarkAttributes.url, 
    		userId: user._id
    	}); 
    	
    	if (duplicateBookmark) {
    		// Session.set('bookmarkDuplicate', true);
    		console.log('Duplicate');
    		return {
    			bookmarkExists: true,
    			_id: duplicateBookmark._id
    		} 
    	}

		var bookmark = _.extend(bookmarkAttributes, {
			userId: user._id, 
			author: user.username, 
			submitted: new Date(),
			commentsCount: 0
		});
		// sAlert.success('Saved', {effect: 'slide'});
		//Session.set('bookmarkSaveSuccess', true);
		var bookmarkId = Bookmarks.insert(bookmark);
		return {
			_id: bookmarkId
		}; 
	}
});

validateBookmark = function (bookmark) { 
	var errors = {};
	if (!bookmark.title) {
		sAlert.warning('Please fill in a title', {effect: 'slide'});
		errors.title = "Please fill in a title";
	}
	if (!bookmark.url) {
		sAlert.warning('Please fill in a URL', {effect: 'slide'});
		errors.url = "Please fill in a URL";
	}	
	return errors; 
}

