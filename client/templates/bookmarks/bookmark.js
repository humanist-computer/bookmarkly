Template.bookmark.helpers({ 
	ownBookmark: function() {
		return this.userId === Meteor.userId(); 
	},
	domain: function() {
		var a = document.createElement('a'); 
		a.href = this.url;
		return a.hostname;
	},
	private: function() {
		if (this.private == true) {
			return true;
		} else {
			return false;
		}
	}
});