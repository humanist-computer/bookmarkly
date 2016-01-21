
Accounts.emailTemplates.siteName = "Bookmarkly";

Accounts.emailTemplates.from = "MySite <support@bookmarkly.com>";

Accounts.emailTemplates.resetPassword.subject = function (user) {
    return "Message for " + user.profile.username;
};

Accounts.emailTemplates.resetPassword.text = function (user, url) {
    var signature = "The Bookmarkly Team";
    //var president = President.findOne();
    //if (president)
    //    president = Meteor.users.findOne(president.presidentId);
    //    signature = president.profile.displayName + ", the MySite President.";

    return "Dear " + user.profile.username + ",\n\n" +
        "Click the following link to set your new password:\n" +
        url + "\n\n" +
        "Please never forget it again!!!\n\n\n" +
        "Cheers,\n" +
        signature;
};

