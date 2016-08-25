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
    email: { type: String, unique: true, required: true, dropDups: true },
    password: { type: String, required: true },
    image: { type: String },
    roles: [{ type: String, enum: ['admin', 'user'] }]
});
// Forst plain text passwords to be hashed.
userSchema.pre('save', function(next) {
    var user = this;
    // Only hash the password if it has been modified (or is new)
    if (user.isModified('password')) {
        user.password = crypto.createHash('md5').update(user.password).digest("hex");
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

module.exports = mongoose.model('User', userSchema);
