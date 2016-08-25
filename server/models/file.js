// Get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Set up a mongoose model and pass it using module.exports
var fileSchema = new Schema({
    // User id that owns the file.
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    // Absolute url to image.
    url: { type: String, unique: true, dropDups: true },
    // File name image was uploaded with.
    name: String,
    // Aboslute path on file system.
    path: String
});

module.exports = mongoose.model('File', fileSchema);
