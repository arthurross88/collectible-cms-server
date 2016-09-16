var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Jimp = require('jimp');
var Config = require('../../config');
var Promise = require('promise');
var fs = require('fs');

// Set up a mongoose model and pass it using module.exports
var fileSchema = new Schema({
    // User id that owns the file.
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    // Name of file on disk.
    name: String,
    // If the file is public or private
    public: Boolean,
});
// Remove physical files assocaited with this object.
fileSchema.pre('remove', function(next) {
    var orig = this.getPathBase() + '/' + this.name;
    var full = this.getPathBase() + '/full/' + this.name;
    var thumb = this.getPathBase() + '/thumb/' + this.name;
    try {
        fs.unlink(orig);
        fs.unlink(full);
        fs.unlink(thumb);
    } catch(e) {
        // Ignore all errors for now.
    }
    next();
});
fileSchema.methods.getUser = function() {
    var f = this;
    var promise = new Promise(function (resolve, reject) {
        User.findById(f.userId, function(err, user) {
            if (err) {
                reject(err);
            }
            resolve(user);
        });
    });
    return promise;
}
fileSchema.methods.getUrlBase = function() {
    return '/uploads/' + this.userId;
}
/**
 * Get the absolute path of directory where original file is located.
 *
 * Does not include trailing slash.
 */
fileSchema.methods.getPathBase = function() {
    var dirUpload = Config.rootPath + '/' + Config.uploadPath;
    var basePath = dirUpload + '/' + this.userId;
    return basePath;
}
/**
 * Get the absolute path of directory where resized full version of file is located.
 *
 * Does not include trailing slash.
 */
fileSchema.methods.getPathFull = function() {
    var userPath = this.getPathBase();
    return userPath + '/full';
}
/**
 * Get the absolute path of directory where resized full version of file is located.
 *
 * Does not include trailing slash.
 */
fileSchema.methods.getPathThumb = function() {
    var userPath = this.getPathBase();
    return userPath + '/thumb';
}
/**
 * Save raw file data to disk and then save this object to database.
 *
 * @returns promise.
 */
fileSchema.methods.saveFile = function(fileData) {
    var f = this;
    var promise = new Promise(function (resolve, reject) {
        // Ignore errors EEXIST and ENOENT.
        var dirUpload = Config.rootPath + '/' + Config.uploadPath;
        fs.mkdir(dirUpload, 0777, function(err) { });
        fs.mkdir(f.getPathBase(), 0777, function(err) { });
        // Save data to disk.
        var fstream = fs.createWriteStream(f.getPathBase() + '/' + f.name);
        fileData.pipe(fstream);
        fstream.on('close', function () {
            // Save file object to database.
            f.save(function(err) {
                if (err) {
                    reject(err);
                } else {
                    Promise.all([f.saveFull(90), f.saveThumb(80)]).then(function() {
                        resolve();
                    }).catch(function(err) {
                        reject(err);
                    });
                }
            });
        });
        fstream.on('error', function(err) {
            reject(err);
        });
    });
    return promise;
};
/**
 * Resize the original image and save to disk.
 *
 * @param width The new image width.
 * @param height The new image height.
 * @param quality The quality in % (0-100).
 * @param outputPath The absolute path and filename where new file should be saved to.
 *
 * @returns promise.
 */
fileSchema.methods.saveResize = function(width, height, quality, outputPath) {
    var f = this;
    var promise = new Promise(function (resolve, reject) {
        Jimp.read(f.getPathBase() + '/' + f.name, function (err, image) {
            if (err) reject(err)
            fs.mkdir(f.getPathBase() + '/thumb', 0777, function(err) { });
            fs.mkdir(f.getPathBase() + '/full', 0777, function(err) { });
            image.scaleToFit(width, height)
                 .quality(quality)
                 .write(outputPath, function(err) {
                    if (err) reject(err);
                    resolve();
                 });
        });
    });
    return promise;
};
/**
 * Resize the original image to 'full' size and save to disk.
 *
 * @param quality The quality in % (0-100).
 *
 * @returns promise.
 */
fileSchema.methods.saveFull = function(quality) {
    return this.saveResize(1024, 768, quality, this.getPathFull() + '/' + this.name);
};
/**
 * Resize the original image to 'full' size and save to disk.
 *
 * @param quality The quality in % (0-100).
 *
 * @returns promise.
 */
fileSchema.methods.saveThumb = function(quality) {
    return this.saveResize(320, 240, quality, this.getPathThumb() + '/' + this.name);
};
fileSchema.methods.getDTO = function() {
    var f = this;
    var dto = new function() {
        this.__file = f;
        this._id = f._id;
        this.userId = f.userId;
        this.name = f.name;
        this.public = f.public;
        this.baseUrl = null;
        this.loadBaseUrl = function() {
            this.baseUrl = this.__file.getUrlBase();
            return true;
        }
        this.loadAll = function() {
            var dto = this;
            var promise = new Promise(function(resolve, reject) {
                dto.loadBaseUrl();
                resolve(dto);
            });
            return promise;
        }
        this.toJSON = function() {
            var ret = {};
            var exclude = ['__file'];
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

module.exports = mongoose.model('File', fileSchema);
