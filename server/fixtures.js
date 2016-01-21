
// Fixture data
if (Bookmarks.find().count() === 0) { 

	var now = new Date().getTime();
  	// create two users
	var amyId = Meteor.users.insert({ 
		profile: { name: 'Amy Sampson' }
	});
	var amy = Meteor.users.findOne(amyId); 
	
	var aaronId = Meteor.users.insert({
    	profile: { name: 'Aaron Marr' }
  	});

	var aaron = Meteor.users.findOne(aaronId);
	
	var ceephaxId = Bookmarks.insert({
		title: 'Ceephax Acid Crew Album',
		userId: aaron._id,
		author: aaron.profile.name,
		url: 'https://boomkat.com/downloads/43569-ceephax-acid-crew-bainted-smile-ep', 
		submitted: new Date(now - 7 * 3600 * 1000),
		commentsCount: 2
	});

	Comments.insert({
		bookmarkId: ceephaxId,
		userId: amy._id,
		author: amy.profile.name,
		submitted: new Date(now - 5 * 3600 * 1000),
		body: 'I love this album',
		commentsCount: 0
	});

	Comments.insert({
		bookmarkId: ceephaxId,
		userId: aaron._id,
		author: aaron.profile.name,
		submitted: new Date(now - 3 * 3600 * 1000), 
		body: 'Yeah, I do too!',
		commentsCount: 0
	});
}