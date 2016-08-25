var fs = require('fs');
var jwt  = require('jsonwebtoken');
var User = require('../models/user');

/**
 * @apiDefine apiPermissionAdmin Admin
 * The request must authenticate the user with a json web token. The user must have a role of "admin".
 */
/**
 * @apiDefine apiPermissionUser User
 * The request must authenticate the user with a json web token. The user must have a role of "user".
 */
/**
 * @apiDefine apiPermissionRegistered Registered
 * The request must authenticate the user with a json web token. No specific user role is required.
 */
/**
 * @apiDefine apiPermissionPublic Public
 * The request may be anonymous. No access token is required. No specific user role is required.
 */

/**
 * @apiDefine apiHeaderAccessToken
 * @apiHeader {string} x-access-token Access token recieved from <a href="/apidoc/#api-Authentication-Authenticate">authentication</a>
 */
/**
 * @apiDefine apiHeaderJson
 * @apiHeader {String} Content-Type=application/json
 */

/**
 * @apiDefine apiSuccessStatus
 * @apiSuccess {Bool} status Always <code>true</code>on success. Request executed without exception.
 */

/**
 * @apiDefine apiErrorGeneric
 * @apiError (Error 4xx) {Bool} status Always <code>false</code> on errors.
 * @apiError (Error 4xx) {String} error The error code identifier.
 * @apiError (Error 4xx) {String} message Additional details about the error.
 */
/**
 * @apiDefine apiErrorExampleAccessToken
 * @apiErrorExample AccessToken
 *     HTTP/1.1 401 Unauthorized
 *     {
 *         "status": false,
 *         "error": "AccessToken",
 *         "message": "The access token in x-access-token header is invalid or expired."
 *     }
 * @apiErrorExample AccessToken
 *     HTTP/1.1 403 Forbidden
 *     {
 *         "status": false,
 *         "error": "AccessToken",
 *         "message": "The x-access-token header is missing."
 *     }
 */
/**
 * @apiDefine apiErrorExampleNotAuthorized
 * @apiErrorExample NotAuthorized
 *     HTTP/1.1 401 Unauthorized
 *     {
 *         "status": false,
 *         "error": "NotAuthorized",
 *         "message": "Current user does not posses correct authorization role."
 *     }
 */
/**
 * @apiDefine apiErrorExampleNotFound
 * @apiErrorExample NotFound
 *     HTTP/1.1 401 Not Found
 *     {
 *         "status": false,
 *         "error": "NotFound",
 *         "message": "The requested item can not be located."
 *     }
 */
/**
 * @apiDefine apiErrorExampleFailure
 * @apiErrorExample Failure
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *         "status": false,
 *         "error": "Failure",
 *         "message": "*A generic description of error will be provided*"
 *     }
 */

module.exports = function(app, router) {
    // Secure following routes with token.
    router.use(function(req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        // Add common API responses.
        res.notAuthorized = function() {
            this.status(401).json({
                "status": false,
                "error": "NotAuthorized",
                "message": "Current user does not posses correct authorization role."
            });
        };
        res.notFound = function() {
            this.status(404).json({
                "status": false,
                "error": "NotFound",
                "message": "The requested item could not be located."
            });
        };
        res.failure = function(err) {
            this.status(500).json({
                "status": false,
                "error": "Failure",
                "message": err.message
            });
        };
        if (token) {
            jwt.verify(token, app.get('tokenSignature'), function(err, decoded) {
            	if (err) {
            		res.status(403).json({
            			"status": false,
            			"error": "BadToken",
            			"message": err.message
            		});
            	} else {
                    req.user = new User(decoded);
            	}
                next();
            });
        } else {
            req.user = new User({
                "_id": 0,
                "roles": [ "anonymous" ]
            });
            next();
        }
    });
    // Include all files and sub-directories.
    fs.readdirSync(__dirname).forEach(function(file) {
        if (file == 'index.js') return;
        var name = file.substr(0, (file.indexOf('.') == -1) ? file.length : file.indexOf('.'));
        require('./' + name)(app, router);
    });
};
