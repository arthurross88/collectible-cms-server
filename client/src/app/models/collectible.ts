var File = require('./file');
var User = require('./user');

export class Collectible {
    // Collectible unique identifier.
    _id: string;
    // User that owns the item.
    userId: string;
    user: any;
    // Title or short name of item.
    name: string;
    // Description of item.
    description: string;
    // Files associated with collectible.
    fileIds: string[];
    files: any[];
    // Friendly url. Automtaically generated from name. e.g. 'my-special-coin'
    url: string;
    // Friendly url. Automatically generated from name. e.g. '/u/someuser/collectible/my-special-coin'
    absoluteUrl: string;
    // If the file is public or private
    public: boolean;
    // How long this item was held.
    aquired: Aquired;
    // Meta information.
    meta: Meta;
    constructor(c?: Collectible) {
        if (c != null) {
            this.map(c);
        }
    }
    map(c: Collectible): Collectible {
        this._id         = (typeof(c._id)         == 'undefined') ? this._id         : c._id;
        this.userId      = (typeof(c.userId)      == 'undefined') ? this.userId      : c.userId;
        this.user        = (typeof(c.user)        == 'undefined') ? this.user        : c.user;
        this.name        = (typeof(c.name)        == 'undefined') ? this.name        : c.name;
        this.description = (typeof(c.description) == 'undefined') ? this.description : c.description;
        this.fileIds     = (typeof(c.fileIds)     == 'undefined') ? this.fileIds     : c.fileIds;
        this.files       = (typeof(c.files)       == 'undefined') ? this.files       : c.files;
        this.url         = (typeof(c.url)         == 'undefined') ? this.url         : c.url;
        this.absoluteUrl = (typeof(c.absoluteUrl) == 'undefined') ? this.absoluteUrl : c.absoluteUrl;
        this.public      = (typeof(c.public)      == 'undefined') ? this.public      : c.public;
        this.aquired     = (typeof(c.aquired)     == 'undefined') ? this.aquired     : c.aquired;
        this.meta        = (typeof(c.meta)        == 'undefined') ? this.meta        : c.meta;
        return this
    }
}

export class Aquired {
    // Date item was first aquired.
    from: string;
    // Date item was released.
    to: string;
    // Details of item acquisition and release.
    description: string;
}

export class Meta {
    created: string;
    updated: string;
}