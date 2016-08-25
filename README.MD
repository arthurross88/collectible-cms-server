# Collectible CMS

A Content Management System for stamps, coins, comic books, and other collectibles.

## Requirements

* Install MondoDB from https://docs.mongodb.com/manual/administration/install-community/
* A bash shell. Using windows? Try Cygwin.

## Installation

Make sure you are running the lastest version of npm.

* `npm install npm -g`

Clone repository and install packages.

* `git clone https://github.com/delphian/collectible-cms.git`
* `cd collectible-cms`
* `npm install`

Customize token secret, port, and site domain.

* `cp templates/config.js.sample ./config.js`
* `cp templates/apidoc.json.sample ./apidoc.json`

Edit config.js and apidoc.js, replacing the default values with more appropriate domain specific ones. _tokenSignature in config.js must be replaced or the site will NOT be secure_.

### Launch the site in development mode

* `npm run prod` or to launch in development mode: `npm run dev`

By visiting http://localhost:8080 for the first time the default admin user
will be created. Remember these credentials.

### Create and view the documentation

* `npm run doc_update`

Visit http://localhost:8080/apidoc/v1 and issue test API requests as desired.

## Sublime Text 3 Support

### Install Typescript Support

* https://github.com/Microsoft/TypeScript-Sublime-Plugin

#### Hide .js and .map Files

In preferences -> Settings -> User

    {
        "file_exclude_patterns": ["collectible-cms/client/**/*.js", "collectible-cms/**/*.map"]
    }
