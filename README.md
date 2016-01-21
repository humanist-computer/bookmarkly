# Bookmarkly
A simple book-marking application built on Meteor.js

### Features
* User sign up / sign in
* Auto page discovery – Bookmarkly discovers page information, such as page title and possible tag words
* Filter / search by tag
* Private / public bookmarks
* (TODO) User profile – display public bookmarks on a user profile page

### Start
To start the app, simply run the meteor command:

    meteor
    => Started proxy.                             
    => Started MongoDB.                            
    => Started your app.                          

    => App running at: http://localhost:3000/

#### Home
If you open your browser at http://localhost:3000/ you should see the app home screen:

![Home page](https://raw.githubusercontent.com/humanist-computer/bookmarkly/master/screenshots/home.png)

#### Add / Edit bookmark
Once signed up, you can sign and begin creating bookmarks. Bookmarkly will automatically grab the page title and possible tags for a given URL.

You can also add your own tags, as required.

![Home page](https://raw.githubusercontent.com/humanist-computer/bookmarkly/master/screenshots/bookmarkedit.png)

#### Dashboard
The dashboard shows your bookmarks. From here you can edit tags, select a tag to filter by, as well as search by tag. 

![Home page](https://raw.githubusercontent.com/humanist-computer/bookmarkly/master/screenshots/dashboard.png)

#### Filter
Select a tag, or search by tag name
![Home page](https://raw.githubusercontent.com/humanist-computer/bookmarkly/master/screenshots/filter.png)

### Dependencies

***Meteor packages***
* meteor-platform
* underscore
* iron:router
* sacha:spin
* accounts-password
* meteorhacks:npm
* npm-container
* http
* natestrauser:select2@=4.0.0
* useraccounts:iron-routing
* ixdi:material-design-iconic-font
* juliancwirko:s-alert
* juliancwirko:s-alert-slide
* juliancwirko:s-alert-scale
* fourseven:scss
* useraccounts:core
* useraccounts:unstyled
* msavin:mongol@=1.1.5

***Node Modules***
* cheerio
