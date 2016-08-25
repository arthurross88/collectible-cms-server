// Get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

// Link collectibles to stampist catalogue.
var stampistCollectibleSchema = new Schema({
    catalogueId: { type: String, ref: "StampistCatalogue" },
    collectibleId: { type: mongoose.Schema.Types.ObjectId, ref: "Collectible" }
});

module.exports = mongoose.model('StampistCollectible', stampistCollectibleSchema);
