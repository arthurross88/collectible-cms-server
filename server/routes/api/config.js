/**
 * @apiDefine apiGroupConfig Config
 *
 * Site wide configuration variables. Generally this should be the first object loaded by the client.
 *
 * <h4 id="configObject" class="object-anchor">Config Object</h4>
 * <pre>
 * {<br />
 *     // Title of the site.<br />
 *     siteTitle: String,<br />
 *     // Description of the site.<br />
 *     siteDescription: String,<br />
 *     // Message Of The Day<br />
 *     motd: String
 * }
 * </pre>
 */

var Config = require('../../models/config');
var User   = require('../../models/user');

module.exports = function(app, router) {
    /**
     * @api {get} /config Read Configuration
     * @apiPermission apiPermissionPublic
     * @apiGroup apiGroupConfig
     * @apiName ReadConfig
     * @apiDescription 
     *     Read the site configuration.
     * @apiUse apiSuccessStatus
     * @apiSuccess {String} data The site configuration.
     * @apiSuccessExample Config Returned
     *     HTTP/1.1 200 OK
     *     {
     *         "status": true,
     *         "data": [{
     *             siteTitle: "Collectible CMS",
     *             siteDescription: "Collecting is fun!",
     *             motd: "Today is the best day of all days!"
     *         }]
     *     }
     * @apiUse apiErrorGeneric
     * @apiUse apiErrorExampleNotAuthorized
     */
    router.get('/config', function(req, res) {
        Config.find({ }, function(err, configs) {
            if (!configs.length) {
                configs.push(createConfig());
                createUser();
            }
            res.json({
                "status": true,
                "data": configs.pop()
            });
        });
    });
    /**
     * @api {patch} /config Update
     * @apiPermission apiPermissionAdmin
     * @apiGroup apiGroupConfig
     * @apiName UpdateConfig
     * @apiDescription 
     *     Update the configuration
     * @apiUse apiHeaderAccessToken
     * @apiUse apiHeaderJson
     * @apiParamExample {JSON} Update Config
     *     {
     *         "siteTitle": "My Collectible CMS".
     *         "siteDescription": "We collect coins!",
     *         "motd": "" 
     *     }
     * @apiUse apiSuccessStatus
     * @apiSuccess {String} data The updated site configuration object.
     * @apiSuccessExample Config Updated
     *     HTTP/1.1 200 OK
     *     {
     *         "status": true,
     *         "data": {
     *             "siteTitle": "My Collectible CMS",
     *             "siteDescription": "We collect coins!",
     *             "motd": ""
     *         }
     *     }
     * @apiUse apiErrorGeneric
     * @apiUse apiErrorExampleAccessToken
     * @apiUse apiErrorExampleNotAuthorized
     * @apiUse apiErrorExampleFailure
     */
    router.patch('/config', function(req, res) {
        if (!req.user.isAdmin()) {
            res.notAuthorized();
        } else {
            var configPatch = req.body;
            Config.find(function(err, configs) {
                if (err) {
                    res.notFound();
                }
                var config = configs.pop();
                config.siteTitle       = (configPatch.siteTitle       != null) ? configPatch.siteTitle       : config.siteTitle;
                config.siteDescription = (configPatch.siteDescription != null) ? configPatch.siteDescription : config.siteDescription;
                config.siteDomain      = (configPatch.siteDomain      != null) ? configPatch.siteDomain      : config.siteDomain;
                config.motd            = (configPatch.motd            != null) ? configPatch.motd            : config.motd;
                config.save(function(err) {
                    if (err) {
                        res.failure(err);
                    } else {
                        res.json({
                            "status": true,
                            "data": config
                        });
                    }
                });
            });
        }
    });
    createConfig = function() {
        var config = new Config();
        config.siteTitle = "Collectible CMS",
        config.motd = "Admin account created. Use admin@localhost/password to login. Immediately change the admin password and MOTD."
        config.save();
        return config;
    }
    createUser = function() {
        var user = new User();
        user.email = "admin@localhost";
        user.password = "password";
        user.name.first = "Admin";
        user.roles = [
            'admin', 
            'user'
        ];
        user.save();
        return user;
    }
}
