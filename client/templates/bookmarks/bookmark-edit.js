var updateSelected = function() {
		var selected = TempTags.find({selected: true}).fetch();
		$('.tagsinput').select2({
			tags: true,
		}).val(_.map(selected, function(item) {
			return item.text;
		})).change();
	},

	updateData = function() {
		var allTags = TempTags.find().fetch();
		console.log('UPDATE DATA:alltags', allTags);
		$('.tagsinput').select2({
			data: allTags,
			tags: true,
		});
	},

	checkTagExists = function(text) {
		return TempTags.find({id: trimWhiteSpace(text)}).fetch();
	},

	initializeSelectedTags = function(tags) {
		console.log('initializeSelectedTags', tags);
		_.each(tags, function(tag) {
	    	if (checkTagExists(tag.text).length === 0) {
	    		TempTags.insert(
	    			{ 	
	    				id: trimWhiteSpace(tag.text),
	    				text: trimWhiteSpace(tag.text),
	    				selected: true 
	    			}
	    		);
	    	} else {
	    		TempTags.update(
	    			{ text: trimWhiteSpace(tag.text) },
	    			{ $set: { selected: true } }
	    		);
	    	}
		});

		updateData();
		updateSelected();
	},

	removeSelectedTagsFromAvailable = function() {

	};

Template.bookmarkEdit.created = function() { 
	Session.set('bookmarkEditErrors', {});
	TempTags = new Mongo.Collection(null);
	Items = new Mongo.Collection(null);
	console.log('DATA', this.data);
}

Template.bookmarkEdit.helpers({ 
	errorMessage: function(field) {
		return Session.get('bookmarkEditErrors')[field]; 
	},
	errorClass: function (field) {
		return !!Session.get('bookmarkEditErrors')[field] ? 'has-error' : '';
	},
	private: function() {
		console.log('private?');
		if (this.private == true) {
			console.log('!!! private bookmark');
			return 'checked';
		} else {
			return '';
		}
	},
	possibleTags: function() {
		console.log("TempTags possibleTags", TempTags.find().fetch());
		return TempTags.find({
			userCreated: false
		});
	}
});

Template.bookmarkEdit.events({ 
	'submit form': function(e) {
		e.preventDefault();

		var bookmarkProperties = null,
			errors = null,

			currentBookmarkId = this._id,

			// We have to sanitise tagsData as it contains references to dom 
			// which leads to infinite loops when saving.
			taginput = $('.tagsinput')[0],
			tagsData = $(taginput).select2('data'),
			tags = [];

		_.each(tagsData, function(tag) {
			tags.push({text: tag.text});
		})
		
		bookmarkProperties = {
			url: $(e.target).find('[name=url]').val(), 
			title: $(e.target).find('[name=title]').val(),
			private: $(e.target).find('[name=private]').is(':checked'),
			tags: tags
		}

		errors = validateBookmark(bookmarkProperties); 

		if (errors.title || errors.url) {
			return Session.set('bookmarkEditErrors', errors);
		}
		
		Bookmarks.update(currentBookmarkId, {
				$set: bookmarkProperties
			}, function(error) { 
				if (error) {
					// display the error to the user
					throwError(error.reason);
				} else {
					Session.set('bookmarkUpdatedSuccess', true);
					Router.go('bookmarkDetails', {_id: currentBookmarkId});
				}
			}
		); 
	},

	'click .js-tag-select-btn': function(e) {
		e.preventDefault();

		var btn = e.currentTarget,
			text = $(btn).text(),
			select = $('.tagsinput'),
			tagName = e.target.innerHTML;

		TempTags.update(
			{ text: trimWhiteSpace(tagName) },
			{ $set: { selected: true } }
		);

		updateSelected();
	},

	'keypress .js-tag-input': function (e, template) {

		var tagsInput     = $('.js-tag-input')[0],
			tag           = null;

	    if (e.which === 13 || e.which === 32) {
	    	e.preventDefault();
			
			tag = $(tagsInput).val();

			TempTags.insert({
				id: trimWhiteSpace(tag),
				text: trimWhiteSpace(tag),
				selected: true,
				userCreated: true
			});

			updateData();
			updateSelected();
			
			$(tagsInput).val('');
			console.log(TempTags.find().fetch());
	    }
	},

	'click .js-delete': function(e) { 
		e.preventDefault();
		if (confirm("Delete this bookmark?")) { 
			var currentBookmarkId = this._id; 
			Session.set('bookmarkDeletedSuccess', true);
			Bookmarks.remove(currentBookmarkId); 
			Router.go('bookmarks');
		} 
	}
});

Template.bookmarkEdit.rendered = function() { 

	var urlInput     = $('.js-url')[0],
		url          = $(urlInput).val(),
		tags         = this.data.tags;

	console.log('url', url);

	Meteor.call('getMostUsedWords', url, 
		function(err, res) {
		if (err) {
			sAlert.error(err.reason);
			return throwError(err.reason);
		} else {
			_.each(res, function(tag){
				TempTags.insert({
					id: trimWhiteSpace(tag),
					text: trimWhiteSpace(tag),
					selected: false,
					userCreated: false
				})
			});
			console.log(TempTags.find().fetch());
			
			updateData();
			initializeSelectedTags(tags);
		}
	});

	console.log(TempTags.find().fetch());

	$('.tagsinput').select2({
		tags: true,

	}).on("select2:unselect", function (e) { 

		var tag = e.params.data.text,
		
			tagModel = TempTags.find({text:tag}).fetch();

		TempTags.update(
			{ text: trimWhiteSpace(tag) },
			{ $set: { selected: false } }
		);

	}).on("select2:select", function(e) {

		var tag = e.params.data.text;

    	if (checkTagExists(tag).length === 0) {
    		var data = e.params.data;
    		TempTags.insert({
    			id: trimWhiteSpace(data.text),
    			text: trimWhiteSpace(data.text),
    			selected: true
    		});
    	} else {
    		TempTags.update(
    			{ text: trimWhiteSpace(tag) },
    			{ $set: { selected: true } }
    		);
    	}
    	updateSelected();
    });

	updateSelected();
	updateInputState('.js-url');
	updateInputState('.js-title');
}
