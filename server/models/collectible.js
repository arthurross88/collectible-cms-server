// Get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var crypto = require("crypto");
var Schema = mongoose.Schema;

// Set up a mongoose model and pass it using module.exports
var collectibleSchema = new Schema({
    // User that owns the item.
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // Title or short name of item.
    name: { type: String, required: true },
    // Description of item.
    description: String,
    // Files associated with collectible.
    fileIds: [ { type: Schema.Types.ObjectId, ref: 'File' } ],
    // Friendly url. Automtaically generated from name. e.g. 'my-special-coin'
    url: { type: String, unique: true },
    // If the file is public or private
    public: Boolean,
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
collectibleSchema.pre('save', function(next) {
    var collectible = this;
    // Generate the collectible url.
    if (collectible.isModified('name')) {
        collectible.url = collectible.name.toLowerCase().replace(/[^0-9a-z-]/g, "-") + '-' +
                          crypto.randomBytes(6).toString('hex')
    }
    next();
});

module.exports = mongoose.model('Collectible', collectibleSchema);
