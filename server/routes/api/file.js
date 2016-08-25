var busboy = require('connect-busboy');
var fs     = require('fs');
var crypto = require("crypto");
var User   = require('../../models/user');
var File   = require('../../models/file');
var config = require('../../../config');

/**
 * @apiDefine apiGroupFile File
 *
 * <h4 id="fileObject" class="object-anchor">File Object</h4>
 * <pre>
 * {<br />
 *     // User id that owns the file.<br />
 *     userId: { type: Schema.Types.ObjectId, ref: 'User' },<br />
 *     // Absolute url to image.<br />
 *     url: { type: String, unique: true, dropDups: true },<br />
 *     // File name image was uploaded with.<br />
 *     name: String<br />
 * }
 * </pre>
 */

module.exports = function(app, router) {
    /**
     * @api {get} /user/:id/file Read All
     * @apiPermission apiPermissionUser
     * @apiGroup apiGroupFile
     * @apiName ReadAll
     * @apiDescription 
     *     Read details for all of user's uploaded files.
     * @apiParam {Int} id The unique user identifier.
     * @apiUse apiHeaderAccessToken
     * @apiUse apiSuccessStatus
     * @apiSuccess {String} data An array of file objects.
     * @apiSuccessExample One File Found
     *     HTTP/1.1 200 OK
     *     {
     *         "status": true,
     *         "data": [{
     *             "_id": "56bacd39fb7a90e31aa5d8a1",
     *			   "userId": "57aacc69fb7e90e81aa5d5d4",
     *			   "url": "http://localhost/u/57aacc69fb7e90e81aa5d5d4/file/somefile.jpg",
     *			   "name": "somefile.jpg"
     *         }]
     *     }
     * @apiSuccessExample No Files Found
     *     HTTP/1.1 200 OK
     *     {
     *         "status": true,
     *         "data": []
     *     }
     * @apiUse apiErrorGeneric
     * @apiUse apiErrorExampleAccessToken
     * @apiUse apiErrorExampleNotAuthorized
     */
    router.get('/user/:id/file', function(req, res) {
        File.find({ userId: req.params.id }, function(err, files) {
            res.json({
                "status": true,
                "data": files
            });
        });
    });
    /**
     * @api {get} /file/:id Read One
     * @apiPermission apiPermissionUser
     * @apiGroup apiGroupFile
     * @apiName ReadOne
     * @apiDescription Read details for a single file uploaded by user.
     * @apiParam {Int} id The unique file identifier.
     * @apiUse apiHeaderAccessToken
     * @apiUse apiSuccessStatus
     * @apiSuccess {String} data A single file object.
     * @apiSuccessExample File Found
     *     HTTP/1.1 200 OK
     *     {
     *         "status": true,
     *         "data": {
     *             "_id": "56bacd39fb7a90e31aa5d8a1",
     *			   "userId": "57aacc69fb7e90e81aa5d5d4",
     *			   "url": "http://localhost/u/57aacc69fb7e90e81aa5d5d4/file/somefile.jpg",
     *			   "name": "somefile.jpg"
     *         }
     *     }
     * @apiUse apiErrorGeneric
     * @apiUse apiErrorExampleAccessToken
     * @apiUse apiErrorExampleNotAuthorized
     * @apiUse apiErrorExampleNotFound
     */
    router.get('/file/:id', function(req, res) {
        if (!req.user.isUser()) {
            res.notAuthorized();
        } else {
            File.findById(req.params.id, function(err, file) {
                if (err) {
                    req.notFound();
                } else {
                    res.json({
                        "status": true,
                        "data": file
                    });
                }
            });
        }
    });
    /**
     * @api {post} /user/:id/file Create
     * @apiPermission apiPermissionUser
     * @apiGroup apiGroupFile
     * @apiName Create
     * @apiDescription Upload a file into user's file repository.
     *     A 10 character random hash will be prepended to the filename to avoid conflicts.
     * @apiUse apiHeaderAccessToken
     * @apiUse apiSuccessStatus
     * @apiSuccess {JSON} data A single file object.
     * @apiSuccessExample File Created
     *     HTTP/1.1 200 OK
     *     {
     *         "_id": "56bacd39fb7a90e31aa5d8a1",
     *		   "userId": "57aacc69fb7e90e81aa5d5d4",
     *		   "url": "http://localhost/u/57aacc69fb7e90e81aa5d5d4/file/somefile.jpg",
     *		   "name": "somefile.jpg"
     *     }
     * @apiUse apiErrorGeneric
     * @apiUse apiErrorExampleAccessToken
     * @apiUse apiErrorExampleNotAuthorized
     * @apiUse apiErrorExampleFailure
     */
    router.post('/user/:id/file', function(req, res) {
        if (!req.user.isUser()) {
            res.notAuthorized();
        } else {
            if (req.busboy) {
                req.pipe(req.busboy);       
                req.busboy.on('file', function (fieldname, fileData, filename) {
                    var reportErr = function(err) {
                        res.failure(err)
                    };
                    var saveFile = function(path, fileData, filename) {
                        fstream = fs.createWriteStream(path);
                        fileData.pipe(fstream);
                        fstream.on('close', function () {
                            // Save file reference to database.
                            var file = new File();
                            file.name = filename;
                            file.path = path;
                            file.url  = config.uploadPath + '/' + req.params.id + '/' + filename;
                            file.save(function(err) {
                                if (err) {
                                    reportErr(err);
                                } else {
                                    res.json({
                                        "status": true,
                                        "data": file
                                    });
                                }
                            });
                        });
                        fstream.on('error', function(err) {
                            reportErr(err);
                        });
                    };
                    // Generate unique filename.
                    filename = crypto.randomBytes(5).toString('hex') + '-' + filename;
                    var dir = config.rootPath + '/' + config.uploadPath + '/' + req.params.id;
                    var path = dir + '/' + filename;
                    fs.mkdir(dir, 0777, function(err) {
                        if (err) {
                            // Ignore the error if the folder already exists.
                            if (err.code == 'EEXIST')
                                saveFile(path, fileData, filename) 
                            else
                                reportErr(err);
                        } else {
                            saveFile(path, fileData, filename);
                        }
                    });
                });
            }
        }
    });
    /**
     * @api {delete} /file/:id Delete
     * @apiPermission apiPermissionAdmin
     * @apiPermission apiPermissionUser
     * @apiGroup apiGroupFile
     * @apiName Delete
     * @apiDescription A role of <code>Admin</code> may delete any file object.
     *                 A role of <code>User</code> may only delete their own
     *                 file object. The physical file will be removed from disk.
     * @apiUse apiHeaderAccessToken
     * @apiParam {Int} id The unique file identifier to delete.
     * @apiUse apiSuccessStatus
     * @apiSuccessExample File Removed
     *     HTTP/1.1 200 OK
     *     {
     *         "status": true,
     *     }
     * @apiUse apiErrorGeneric
     * @apiUse apiErrorExampleAccessToken
     * @apiUse apiErrorExampleNotAuthorized
     * @apiUse apiErrorExampleFailure
     * @apiUse apiErrorExampleNotFound
     */
    router.delete('/file/:id', function(req, res) {
        if (!req.user.isUser()) {
            res.notAuthorized();
        } else {
            File.findById(req.params.id, function(err, file) {
                if (err) {
                    res.notFound();
                } else {
                	if (!req.user.isAdmin() && req.user._id != file.userId) {
                		res.notAuthorized();
                	} else {
	                    file.remove(function(err, file) {
	                        if (err) {
	                            res.failure(err);
	                        } else {
	                            res.json({
	                                "status": true,
	                            });
	                        }
	                    });
                	}
                }
            });
        }
    });
}
