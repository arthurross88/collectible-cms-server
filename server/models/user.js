// Get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

// Set up a mongoose model and pass it using module.exports
var userSchema = new Schema({
    name: {
        first: String,
        middle: String,
        last: String,
        suffix: String
    },
    // Public facing name of the user.
    alias: { type: String, unique: true, minlength: 3, maxlength: 23 },
    // The alais used as the suffix to /u user profile paths. Automatically
    // generated based on alias, or _id if alias is not set.
    url: { type: String, unique: true },
    // Login email address.
    email: { type: String, unique: true, required: true },
    // Login password.
    password: { type: String, required: true },
    // Self description of who user is.
    profile: { type: String },
    imageId: { type: Schema.Types.ObjectId, ref: 'File' },
    roles: [{ type: String, enum: ['admin', 'user', 'anonymous'] }]
});
// Forst plain text passwords to be hashed.
userSchema.pre('save', function(next) {
    var user = this;
    // Only hash the password if it has been modified (or is new)
    if (user.isModified('password')) {
        user.password = crypto.createHash('md5').update(user.password).digest("hex");
    }
    if (user.alias == null) {
        delete user.alias;
    }
    if (user.alias !== undefined) {
        user.url = user.alias.toLowerCase().replace(/[^0-9a-z]/g, "");
    } else {
        user.url = user._id;
    }
    next();
});
// Get full name.
userSchema.methods.fullName = function() {
    return this.name.first + " " + this.name.last;
};
userSchema.methods.hasRole = function(role) {
    var hasRole = false;
    if ((typeof(this.roles) != 'undefined') && (this.roles != null) && this.roles.length) {
        hasRole = (this.roles.indexOf(role) > -1);
    }
    return hasRole
}
userSchema.methods.isAdmin = function() {
    return this.hasRole('admin');
};
userSchema.methods.isUser = function() {
    return this.hasRole('user');
};
userSchema.methods.isRegistered = function() {
    return ((this._id) != 0);
};
userSchema.methods.isAnonymous = function() {
    return (this._id == 0);
};
userSchema.methods.getDTO = function() {
    var u = this;
    var dto = new function() {
        this.__user = u;
        this._id = u._id;
        this.name = u.name;
        this.alias = u.alias;
        this.url = u.url;
        this.email = u.email;
        this.imageId = u.imageId;
        this.profile = u.profile;
        this.roles = u.roles;
        this.loadAll = function() {
            var dto = this;
            var promise = new Promise(function(resolve, reject) {
                resolve(dto);
            });
            return promise;
        }
        this.toJSON = function() {
            var ret = {};
            var exclude = ['__user'];
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

module.exports = mongoose.model('User', userSchema);
