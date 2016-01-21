// check that the userId specified owns the bookmark
ownsBookmark = function(userId, bookmark) { 
	return bookmark && bookmark.userId === userId;
}

ownBookmarks = function(userId) { 
	return Bookmarks.find({userId: userId})
}

publicBookmarks = function() { 
	return Bookmarks.find({private: false})
}