/**
 * @apiDefine apiGroupCollectible Collectible
 *
 * A collectible is an individual item that has been collected, such as a stamp or coin. A user
 * account must exist before creating collectibles is allowed. An individual collectible does not require
 * a catalogue or classification system. A collectible, with a name and an image of a stamp, may be
 * created without expressly catagorizing the collectible as a stamp. Context of what an item is may
 * only be obtained by associating the collectible with a record in a catalogue (such as the
 * StampistCatalogue or ScottCatalogue).
 *
 * This allows a user to quickly create several records of items thaty have collected without the
 * requirement to search for it's appropriate catalogue entry or classification.
 *
 * <h4 id="collectibleObject" class="object-anchor">Collectible Object</h4>
 * <pre>
 * {<br />
 *     // User that owns the item.<br />
 *     userId: { type: Schema.Types.ObjectId, ref: 'User' },<br />
 *     // Title or short name of item.<br />
 *     name: String,<br />
 *     // Description of item.<br />
 *     description: String,<br />
 *     // Files associated with collectible.<br />
 *     fileIds: [ { type: Schema.Types.ObjectId, ref: 'File' } ],<br />
 *     // When requesting details then file objects will also be returned in array.<br />
 *     files: [ <a href="#fileObject" class="object-link">File Object</a> ]<br />
 *     // Friendly url. Automtaically generated from name. e.g. 'my-special-coin'<br />
 *     url: { type: String, unique: true },<br />
 *     // If the collectible is public or private
 *     public: Boolean,
 *     // How long this item was held.<br />
 *     aquired: {<br />
 *         // Date item was first aquired.<br />
 *         from: Date,<br />
 *         // Date item was released.<br />
 *         to: Date,<br />
 *         // Details of item acquisition and release.<br />
 *         description: String<br />
 *     },<br />
 *     // Meta information.<br />
 *     meta: {<br />
 *         created: Date,<br />
 *         updated: Date,<br />
 *     }<br />
 * }
 * </pre>
 */

var Promise     = require('promise');
var User        = require('../../models/user');
var Collectible = require('../../models/collectible');
var File        = require('../../models/file');

module.exports = function(app, router) {
    /**
     * @api {get} /collectible Read All
     * @apiPermission apiPermissionPublic
     * @apiGroup apiGroupCollectible
     * @apiName ReadAll
     * @apiDescription
     *     Read details for all collectibles. Collectibles owned by the requestor will always
     *     be returned. If role is <code>Admin</code> then all collectibles will be returned, 
     *     otherwise only collectibles marked public will be returned. Results are sorted in
     *     descending order of creation time (most recent first).
     * @apiUse apiHeaderAccessToken
     * @apiParam {Number} [offset=1] The number of records to skip.
     * @apiParam {Number} [limit=10] The number of records to retrieve.
     * @apiUse apiSuccessStatus
     * @apiSuccess {Array} data An array of collectible objects.
     * @apiSuccessExample One Collectible Found
     *     HTTP/1.1 200 OK
     *     {
     *         "status": true,
     *         "data": [
     *             <a href="#collectibleObject" class="object-link">Collectible Object</a>
     *         ]
     *     }
     * @apiSuccessExample No Collectibles Found
     *     HTTP/1.1 200 OK
     *     {
     *         "status": true,
     *         "data": []
     *     }
     * @apiUse apiErrorExampleFailure
     */
    router.get('/collectible', function(req, res) {
        var offset = parseInt(req.query.offset || 0);
        var limit  = parseInt(req.query.limit  || 10);
        var search = { };
        if (!req.user.isAdmin()) {
            search.$or = [ { userId: req.user._id }, { public: true } ];
        }
        Collectible.find(search, function(err, collectibles) {
            if (err) {
                res.failure(err);
            } else {
                var dtos = [];
                var promises = [];
                for (var i = 0; i < collectibles.length; i++) {
                    var dto = collectibles[i].getDTO();
                    dtos.push(dto);
                    promises.push(dto.loadAll());
                }
                Promise.all(promises).then(function(data) {
                    res.json({
                        "status": true,
                        "data": dtos
                    });
                }).catch(function(err) {
                    res.failure(err);
                });
            }
        }).skip(offset).limit(limit).sort( [['_id', -1]] );
    });
    /**
     * @api {get} /u/:id/collectible Read All From User
     * @apiPermission apiPermissionPublic
     * @apiGroup apiGroupCollectible
     * @apiName ReadAllFromUser
     * @apiDescription 
     *     Read details for all of user's collectibles. Collectibles owned by the requestor will
     *     always be returned. If role is <code>Admin</code> then all collectibles will be returned, 
     *     otherwise only collectibles marked public will be returned. Results are sorted in
     *     descending order of creation time (most recent first).
     * @apiParam {Number} id The unique user identifier.
     * @apiUse apiHeaderAccessToken
     * @apiParam {Number} [offset=1] The number of records to skip.
     * @apiParam {Number} [limit=10] The number of records to retrieve.
     * @apiParam {Boolean} [details=1] Load file objects into <code>files</code> property.
     * @apiUse apiSuccessStatus
     * @apiSuccess {String} data An array of collectible objects.
     * @apiSuccessExample One File Found
     *     HTTP/1.1 200 OK
     *     {
     *         "status": true,
     *         "data": [ 
     *             <a href="#collectibleObject" class="object-link">Collectible Object</a>
     *         ]
     *     }
     * @apiSuccessExample No Files Found
     *     HTTP/1.1 200 OK
     *     {
     *         "status": true,
     *         "data": []
     *     }
     */
    router.get('/u/:id/collectible', function(req, res) {
        var offset = parseInt(req.query.offset || 0);
        var limit  = parseInt(req.query.limit  || 10);
        var search = {
            userId: req.params.id,
        }
        if (!req.user.isAdmin()) {
            search.public = true;
        }
        // Sort by creation time, descending order.
        Collectible.find(search, function(err, collectibles) {
            var dtos = [];
            var promises = [];
            for (var i = 0; i < collectibles.length; i++) {
                var dto = collectibles[i].getDTO();
                dtos.push(dto);
                promises.push(dto.loadAll());
            }
            Promise.all(promises).then(function(data) {
                res.json({
                    "status": true,
                    "data": dtos
                });
            }).catch(function(err) {
                res.failure(err);
            });
        }).skip(offset).limit(limit).sort( [['_id', -1]] );
    });
    /**
     * @api {get} /collectible/:id Read One
     * @apiPermission apiPermissionPublic
     * @apiGroup apiGroupCollectible
     * @apiName ReadOne
     * @apiDescription
     *     Read details for a single Collectible. A Collectible owned by the requestor will
     *     always be returned. A role of <code>Admin</code> will always have Collectible returned,
     *     otherwise only if the Collectible is marked public will it be returned.
     * @apiParam {String} id The unique Collectible identifier, or unique collectible url.
     * @apiUse apiHeaderAccessToken
     * @apiUse apiSuccessStatus
     * @apiSuccess {String} data A single Collectible object.
     * @apiSuccessExample Collectible Found
     *     HTTP/1.1 200 OK
     *     {
     *         "status": true,
     *         "data": <a href="#collectibleObject" class="object-link">Collectible Object</a>
     *     }
     * @apiUse apiErrorExampleNotFound
     */
    router.get('/collectible/:id', function(req, res) {
        var search = { };
        if ((new RegExp("^[0-9a-fA-F]{24}$")).test(req.params.id)) {
            search.$or = [ { _id: req.params.id }, { url: req.params.id } ];
        } else {
            search.url = req.params.id;
        }
        if (!req.user.isAdmin()) {
            search['public'] = true;
        }
        Collectible.find(search, function(err, collectibles) {
            if (err) {
                res.notFound(err);
            } else {
                var dto = collectibles.pop().getDTO();
                dto.loadAll().then(function(data) {
                    res.json({
                        "status": true,
                        "data": dto
                    });
                }).catch(function(err) {
                    res.failure(err);
                });
            }
        });
    });
    /**
     * @api {post} /u/:id/collectible Create
     * @apiPermission apiPermissionUser
     * @apiGroup apiGroupCollectible
     * @apiName Create
     * @apiDescription Create an item that has been collected.
     * @apiUse apiHeaderAccessToken
     * @apiUse apiHeaderJson
     * @apiParam {Number} id The unique user identifier.
     * @apiParamExample {JSON} Request Example
     *     {
     *         "name": "My Lucky Coin",
     *         "description": "This is the lucky coin that my grandfather gave to me.",
     *         "images": [
     *             "http://www.collectiblecms/u/admin/coin.png"
     *         ],
     *         "aquired": {
     *             "from": "2016-08-16T01:41:24.482Z",
     *             "to": null,
     *             "description": "He handed it to me with a smile."
     *         }
     *     }
     * @apiUse apiSuccessStatus
     * @apiSuccess {String} data A single collectible object.
     * @apiSuccessExample Collectible Created
     *     HTTP/1.1 200 OK
     *     {
     *         "status": true,
     *         "data": <a href="#collectibleObject" class="object-link">Collectible Object</a>
     *     }
     * @apiUse apiErrorExampleAccessToken
     * @apiUse apiErrorExampleNotAuthorized
     * @apiUse apiErrorExampleFailure
     */
    router.post('/u/:id/collectible', function(req, res) {
        if (!req.user.isUser()) {
            res.notAuthorized();
        } else {
            req.body.userId = (typeof(req.body.userId) == "undefined" || !req.user.isAdmin()) ? req.user._id : req.body.userId;
            if (typeof(req.body['meta']) == 'undefined' || !req.user.isAdmin()) {
                req.body.meta = {
                    created: new Date,
                    updated: new Date
                };
            }
            var collectible = new Collectible(req.body);
            collectible.save(function(err) {
                if (err) {
                    res.failure(err);
                } else {
                    res.json({
                        "status": true,
                        "data": collectible
                    });
                }
            });
        }
    });
    /**
     * @api {delete} /collectible/:id Delete
     * @apiPermission apiPermissionUser
     * @apiGroup apiGroupCollectible
     * @apiName Delete
     * @apiDescription A role of <code>Admin</code> may delete any collectible.
     *                 A role of <code>User</code> may only delete their own
     *                 collectible.
     * @apiUse apiHeaderAccessToken
     * @apiParam {Int} id The unique identifier of collectible to delete.
     * @apiUse apiSuccessStatus
     * @apiSuccessExample Collectible Removed
     *     HTTP/1.1 200 OK
     *     {
     *         "status": true,
     *     }
     * @apiUse apiErrorExampleAccessToken
     * @apiUse apiErrorExampleNotAuthorized
     * @apiUse apiErrorExampleFailure
     * @apiUse apiErrorExampleNotFound
     */
    router.delete('/collectible/:id', function(req, res) {
        Collectible.findById(req.params.id, function(err, collectible) {
            if (err) {
                res.notFound();
            } else {
                if ((collectible.userId != req.user._id) && (!req.user.isAdmin())) {
                    res.notAuthorized();
                } else {
                    collectible.remove(function (err) {
                        if (err) {
                            res.failure(err);
                        } else {
                            res.json({ "status": true });
                        }
                    });
                }
            }
        });
    });
    /**
     * @api {patch} /collectible/:id Update
     * @apiPermission apiPermissionUser
     * @apiGroup apiGroupCollectible
     * @apiName Update
     * @apiDescription A role of <code>Admin</code> may update any collectible object.
     *                 A role of <code>User</code> may only update a collectible object
     *                 that they own. Because this is a patch, and not a post, only
     *                 the fields to change need to be included in json body.
     * @apiUse apiHeaderAccessToken
     * @apiUse apiHeaderJson
     * @apiParam {Int} id The unique identifier for collectible to update.
     * @apiParamExample {JSON} Update Full Record
     *     {
     *         "name": "My Lucky Coin",
     *         "description": "This is the lucky coin that my grandfather gave to me.",
     *         "images": [
     *             "http://www.collectiblecms/u/admin/coin.png"
     *         ],
     *         "aquired": {
     *             "from": "2016-08-16T01:41:24.482Z",
     *             "to": null,
     *             "description": "He handed it to me with a smile."
     *         }
     *     }
     * @apiParamExample {JSON} Update Partial Record
     *     {
     *         "name": "Renamed Lucky Coin"
     *     }
     * @apiUse apiSuccessStatus
     * @apiSuccess {String} data A single user object.
     * @apiSuccessExample Collectible Updated
     *     HTTP/1.1 200 OK
     *     {
     *         "status": true,
     *         "data": <a href="#collectibleObject" class="object-link">Collectible Object</a>
     *     }
     * @apiUse apiErrorExampleAccessToken
     * @apiUse apiErrorExampleNotAuthorized
     * @apiUse apiErrorExampleFailure
     * @apiUse apiErrorExampleNotFound
     */
    router.patch('/collectible/:id', function(req, res) {
        Collectible.findById(req.params.id, function(err, collectible) {
            if (err) {
                res.notFound();
            } else {
                if ((collectible.userId != req.user._id) && (!req.user.isAdmin())) {
                    res.notAuthorized();
                } else {
                    var collectiblePatch = req.body;
                    collectible.name = (typeof(collectiblePatch.name) == 'undefined') ? collectible.name : collectiblePatch.name;
                    collectible.save(function(err) {
                        if (err) {
                            req.failure(err);
                        } else {
                            res.json({
                                "status": true,
                                "data": collectible
                            });
                        }
                    });
                }
            }
        });
    });
}
