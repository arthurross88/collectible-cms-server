// Get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Set up a mongoose model and pass it using module.exports
var ScottCatalogueSchema = new Schema({
    // Scott catalogue number.
    _id: String,
    // Date of issue.
    year: Date,
    // Number issued.
    amount: Number,
    // Denomination
    denomination: Number,
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

module.exports = mongoose.model('ScottCatalogue', ScottCatalogueSchema);
