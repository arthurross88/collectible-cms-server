// Get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

// Set up a mongoose model and pass it using module.exports
var stampistCatalogueSchema = new Schema({
    // Unique universal id of stamp.
    _id: String,
    // Country code of issue.
    country: String,
    // Province of district of issue.
    province: String,
    // Date of issue.
    year: Date,
    // Number issued.
    amount: Number,
    // Denomination
    denomination: Number,
    // Unit of denomination
    unit: String,
    // Title or short name of stamp.
    name: String,
    // Primary color of stamp.
    color: String,
    // Text present on the stamp.
    text: String,
    // Description of stamp.
    description: String,
    // Url of image.
    image: [String]
});

module.exports = mongoose.model('StampistCatalogue', stampistCatalogueSchema);
