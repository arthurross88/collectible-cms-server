// Get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var crypto   = require("crypto");
var Schema   = mongoose.Schema;
var File     = require('./file');
var Promise  = require('promise');

// Set up a mongoose model and pass it using module.exports
var collectibleSchema = new Schema({
    // User that owns the item.
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // Title or short name of item.
    name: { type: String, required: true },
    // Description of item.
    description: String,
    // File ids associated with collectible.
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
collectibleSchema.methods.loadFiles = function() {
    var collectible = this;
    var promise = new Promise(function (resolve, reject) {
        if (collectible.fileIds !== undefined) {
            File.find({_id: { 
                $in: collectible.fileIds.map(function(o) { return mongoose.Types.ObjectId(o); })
            }}, function(err, files) {
                resolve(files);
            });
        }
    });
    return promise;
};
collectibleSchema.methods.getDTO = function() {
    var c = this;
    var dto = new function() {
        this.__c = c;
        this._id = c._id;
        this.userId = c.userId;
        this.name = c.name;
        this.description = c.description;
        this.fileIds = c.fileIds;
        this.url = c.url;
        this.meta = c.meta;
        this.aquired = c.aquired;
        this.loadFiles = function() {
            var c = this;
            var promise = new Promise(function(resolve, reject) {
                c.__c.loadFiles().then(function(data) {
                    c.files = data;
                    resolve(data);
                }).catch(function(data) {
                    reject(data);
                });
            });
            return promise;
        };
        this.toJSON = function() {
            var ret = {};
            var exclude = ['__c'];
            for (var property in this) {
                if (this.hasOwnProperty(property) && exclude.indexOf(property) == -1) {
                    ret[property] = this[property];
                }
            }
            return ret;
        }
    }
    return dto;
}
module.exports = mongoose.model('Collectible', collectibleSchema);
