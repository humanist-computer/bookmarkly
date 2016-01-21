Comments = new Mongo.Collection('comments');

Meteor.methods({
	commentInsert: function(commentAttributes) {
		check(this.userId, String); 
		check(commentAttributes, {
      		bookmarkId: String,
      		body: String
    	});
		var user = Meteor.user();
		var bookmark = Bookmarks.findOne(commentAttributes.bookmarkId);
		if (!bookmark) {
			throw new Meteor.Error('invalid-comment', 'You must comment on a post');
		}

		comment = _.extend(commentAttributes, { 
			userId: user._id,
			author: user.username,
			submitted: new Date()
		});

		// update the bookmark with the number of comments
		Bookmarks.update(comment.bookmarkId, {$inc: {commentsCount: 1}});

		return Comments.insert(comment); 
	}
});