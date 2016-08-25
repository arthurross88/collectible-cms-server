// Get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Set up a mongoose model and pass it using module.exports
var configSchema = new Schema({
    // Title of the site.
    siteTitle: String,
    // Description of the site.
    siteDescription: String,
    // Domain name of base site without trailing slash. e.g. www.collectiblecms.com
    siteDomain: String,
    // Message Of The Day.
    motd: String
});

module.exports = mongoose.model('Config', configSchema);
