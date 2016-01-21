Meteor.publish('bookmarks', function() { 
	// return Bookmarks.find();
	var userId = this.userId;
	console.log('userId: ', userId);
	return ownBookmarks(userId);
});

Meteor.publish('bookmarks', function() { 
	// return Bookmarks.find();
	var userId = this.userId;
	console.log('userId: ', userId);
	return ownBookmarks(userId);
});

Meteor.publish('userList', function() { 
	// return Bookmarks.find();
	// var userId = this.userId;
	// console.log('userId: ', userId);
	return Meteor.users.find({});
});

Meteor.publish('publicBookmarks', function() { 
	// return Bookmarks.find();
	// var userId = this.userId;
	// console.log('userId: ', userId);
	return publicBookmarks();
});

Meteor.publish('comments', function(bookmarkId) { 
	check(bookmarkId, String);
	return Comments.find({
		bookmarkId: bookmarkId
	});
});

Meteor.methods({

	"userExists": function(username) {
		check(username, String);
		return !!Meteor.users.findOne({
			username: username
		});
	},

	checkUrlValidity: function(url) {
		if (url.indexOf("http://") > -1 || url.indexOf("https://") > -1) {
			try {
				result = Meteor.http.get(url);
			} catch (e) {
    			throw e;
			}
		} else {
			throw {
				reason: 'URL did not contain http:// or https://'
			};
		}
	}, 

	getPageTitle: function(url) {

		var cheerio = Meteor.npmRequire('cheerio'),
			result  = null,
			title   = null,
			trimmed = null;

		if (url.indexOf("http://") > -1 || url.indexOf("https://") > -1) {

			try {
				result = Meteor.http.get(url);
				$ = cheerio.load(result.content);
				title = $("title").text();

				trimmed = trimWhiteSpace(title);
				return trimmed;
			} catch (e) {
				console.log('Error getting URL: ', e);
    			throw e;
			}
		} else {
			console.log('URL did not contain http:// or https://');
			return '';
		}
	}, 
	getMostUsedWords: function(url) {
				
		var cheerio      = Meteor.npmRequire('cheerio'),
			result       = null,
			ptags        = null,
			allWords     = null,
			possibleTags = null,
			tagWords     = null,
			joined       = null;

		if (url.indexOf("http://") > -1 || url.indexOf("https://") > -1) {

			try {
				result = Meteor.http.get(url);
				$ = cheerio.load(result.content);

				ptags = $("p");
				allWords = [];

				$( ptags ).each(function( index ) {
				    var str = $(this).text(),
				  	    words = str.split(/\b/);

				    allWords.push(words);
				});

				joined = allWords.join(',');

				function getFrequency2(string, cutOff) {

					var cleanString = string.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,""),
						words = cleanString.split(' '),
						frequencies = {},
						word, frequency, i;

					for( i=0; i<words.length; i++ ) {
						word = words[i];
						frequencies[word] = frequencies[word] || 0;
						frequencies[word]++;
					}

					words = Object.keys( frequencies );

					return words.sort(function (a,b) { 
						return frequencies[b] -frequencies[a];
					}).slice(0, cutOff);
				}

				possibleTags = getFrequency2(joined, 25);

				// Strip possible tags of common words etc... 
				tagWords = _.without(possibleTags,
					'',
					'\t\n',
					'\n',
					'Are',
					'are',
					'The',
					'the',
					'Be',
					'be',
					'To',
					'to',
					'Of',
					'of',
					'And',
					'and',
					'A',
					'a',
					'In',
					'in',
					'That',
					'that',
					'Have',
					'have',
					'I',
					'i',
					'It',
					'it',
					'For',
					'for',
					'Not',
					'not',
					'On',
					'on',
					'With',
					'with',
					'He',
					'he',
					'As',
					'as',
					'You',
					'you',
					'Do',
					'do',
					'At',
					'at',
					'This',
					'this',
					'But',
					'but',
					'His',
					'his',
					'By',
					'by',
					'From',
					'from',
					'They',
					'they',
					'We',
					'we',
					'Say',
					'say',
					'Her',
					'her',
					'She',
					'she',
					'Or',
					'or',
					'An',
					'an',
					'Will',
					'will',
					'My',
					'my',
					'One',
					'one',
					'All',
					'all',
					'Would',
					'would',
					'There',
					'there',
					'Their',
					'their',
					'What',
					'what',
					'so',
					'So',
					'up',
					'Up',
					'out',
					'Out',
					'if',
					'If',
					'about',
					'About',
					'who',
					'Who',
					'get',
					'Get',
					'which',
					'Which',
					'go',
					'Go',
					'me',
					'Me',
					'when',
					'When',
					'make',
					'Make',
					'can',
					'Can',
					'like',
					'Like',
					'time',
					'Time',
					'no',
					'No',
					'just',
					'Just',
					'him',
					'Him',
					'know',
					'Know',
					'take',
					'Take',
					'people',
					'People',
					'into',
					'Into',
					'year',
					'Year',
					'your',
					'Your',
					'good',
					'Good',
					'some',
					'Some',
					'could',
					'Could',
					'them',
					'Them',
					'see',
					'See',
					'other',
					'Other',
					'than',
					'Than',
					'then',
					'Then',
					'now',
					'Now',
					'look',
					'Look',
					'only',
					'Only',
					'come',
					'Come',
					'its',
					'Its',
					'over',
					'Over',
					'think',
					'Think',
					'also',
					'Also',
					'back',
					'Back',
					'after',
					'After',
					'use',
					'Use',
					'two',
					'Two',
					'how',
					'How',
					'our',
					'Our',
					'work',
					'Work',
					'first',
					'First',
					'well',
					'Well',
					'way',
					'Way',
					'even',
					'Even',
					'new',
					'New',
					'want',
					'Want',
					'because',
					'Because',
					'any',
					'Any',
					'these',
					'These',
					'give',
					'Give',
					'day',
					'Day',
					'most',
					'Most',
					'us',
					'Us'
				);
	
				tagWords = _.map(tagWords, function(string){
					return string.replace(/['"]+/g, '');
				});

				console.log('tagWords', tagWords);
				console.log('possibleTags', possibleTags);

				return tagWords;
			} catch (e) {
				console.log('Error getting URL: ', e);
    			return '';
			}
		} else {
			console.log('URL did not contain http:// or https://');
			return '';
		}
	}
});
