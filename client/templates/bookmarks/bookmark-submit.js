var updateSelected = function() {
	var selected = TempTags.find({selected: true}).fetch();
	$('.tagsinput').select2({
		tags: true,
		minimumResultsForSearch: Infinity,
	}).val(_.map(selected, function(item) {
		return item.text;
	})).change();
}

var updateData = function() {
	var allTags = TempTags.find().fetch();
	$('.tagsinput').select2({
		data: allTags,
		tags: true
	});
}

var checkTagExists = function(text) {
	return TempTags.find({text: text}).fetch();
}

Template.bookmarkSubmit.events({ 
	'keyup .js-url': function() {

		var urlInput     = $('.js-url')[0],
			url          = $(urlInput).val(),
			titleInput   = null,
			possibleTags = null;

		if (typeof prevUrl == 'undefined' || prevUrl != url) {
			
			Meteor.call('checkUrlValidity', url, function(err) {
				if (!err) {
					sAlert.info("Gethering webpage info");
					gatherFacts(url);
				}
			});

			var gatherFacts = function(url) {
				Meteor.call('getPageTitle', url, function(err, res) {
					if (err) {
						titleInput = $('.js-title')[0];
						$(titleInput).val('');
						sAlert.error(err.reason);
						return throwError(err.reason);
					} else {
						titleInput = $('.js-title')[0];
						$(titleInput).val(res);
						sAlert.success("Found page title");
						updateInputState('.js-title');
					}
				});

				possibleTags = Meteor.call('getMostUsedWords', url, 
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
						sAlert.success("Gathered possible tags");
						updateData();
					}
				});
			}
		} 
		prevUrl = url;
	},

	'click .js-tag-select-btn': function(e) {
		e.preventDefault();

		var btn = e.currentTarget,
			text = $(btn).text(),
			select = $('.tagsinput'),
			tagName = e.target.innerHTML;

		TempTags.update(
			{ text: tagName },
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

	'submit form': function(e) {

		e.preventDefault();

		var url = $(e.target).find('[name=url]').val(),
			title = $(e.target).find('[name=title]').val();

		Meteor.call('checkUrlValidity', url, function(err) {
			if (err) {
				sAlert.error("Looks like you are trying to save an invalid URL");
			} else {
				createBookmark();
			}
		});

		var createBookmark = function() {
			var bookmarkProperties = null,
				errors = null,

				taginput = $('.tagsinput')[0],
				tagsData = $(taginput).select2('data'),
				tags = [];

			_.each(tagsData, function(tag) {
				tags.push({text: trimWhiteSpace(tag.text)});
			})
			
			// Leaving this here until we implement social aspects
			// of the app...
			// bookmarkProperties = {
			// 	url: url, 
			// 	title: title,
			// 	private: $(e.target).find('[name=private]').is(':checked'),
			// 	tags: tags
			// }

			// Setting all bookmarks to private until we impelment 
			// sharing feataure
			bookmarkProperties = {
				url: url, 
				title: title,
				private: true,
				tags: tags
			}

			errors = validateBookmark(bookmarkProperties);

			if (errors.title || errors.url) {
				return Session.set('bookmarkSubmitErrors', errors);
			}

			var successCallback = function(error, result) { 
				// display the error to the user and abort
				if (error) {
	    			sAlert.error(error.reason);
					return throwError(error.reason);
				}
				if (result.bookmarkExists) {
					// sAlert.error('You have already bookmarked this URL', {effect: 'slide'});
					Session.set('bookmarkDuplicate', true);
					Router.go('bookmarkDetails', {_id: result._id});
					return throwError('You have already saved this bookmark.');
				}

				Session.set('bookmarkSaveSuccess', true);
			    Router.go('bookmarkDetails', {_id: result._id});
		
			};

			Meteor.call('bookmarkSubmit', bookmarkProperties, 
				successCallback);
		}
	}
});

Template.bookmarkSubmit.created = function() { 
	Session.set('bookmarkSubmitErrors', {});
	TempTags = new Mongo.Collection(null);
	Items = new Mongo.Collection(null);
}

Template.bookmarkSubmit.rendered = function() { 

	TempTags.remove({});

	$('.tagsinput').select2({
		tags: true,

	}).on("select2:unselect", function (e) { 

		var tag = e.params.data.text,
		
			tagModel = TempTags.find({text:tag}).fetch();

		TempTags.update(
			{ text: tag },
			{ $set: { selected: false } }
		);

	}).on("select2:select", function(e) {

		var tag = e.params.data.text;

    	if (checkTagExists(tag).length === 0) {
    		TempTags.insert(e.params.data);
    	} else {
    		TempTags.update(
    			{ text: tag },
    			{ $set: { selected: true } }
    		);
    	}
    	updateSelected();
    });
}

Template.bookmarkSubmit.helpers({ 
	errorMessage: function(field) {
		return Session.get('bookmarkSubmitErrors')[field]; 
	},
	errorClass: function (field) {
		return !!Session.get('bookmarkSubmitErrors')[field] ? 'has-error' : '';
	},
	possibleTags: function() {
		return TempTags.find({
			userCreated: false
		});
	}
});