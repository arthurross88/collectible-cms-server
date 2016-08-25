// Get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Set up a mongoose model and pass it using module.exports
var collectibleSchema = new Schema({
    // User that owns the item.
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    // Title or short name of item.
    name: String,
    // Description of item.
    description: String,
    // Urls of image.
    images: [String],
    // How long this item was held.
    aquired: {
        // Date item was first aquired.
        from: Date,
        // Date item was released.
        to: Date,
        // Details of item acquisition and release.
        description: String
    },
    // Meta information.
    meta: {
        created: Date,
        updated: Date,
    }
});

module.exports = mongoose.model('Collectible', collectibleSchema);
