
export class Collectible {
    // Collectible unique identifier.
    _id: string;
    // User that owns the item.
    userId: string;
    // Title or short name of item.
    name: string;
    // Description of item.
    description: string;
    // Files associated with collectible.
    fileIds: [string];
    // Friendly url. Automtaically generated from name. e.g. 'my-special-coin'
    url: string;
    // If the file is public or private
    public: boolean;
    // How long this item was held.
    aquired: {
        // Date item was first aquired.
        from: string;
        // Date item was released.
        to: string;
        // Details of item acquisition and release.
        description: string;
    };
    // Meta information.
    meta: {
        created: string;
        updated: string;
    }
    constructor(c?: Collectible) {
        if (c != null) {
            this.map(c);
        }
    }
    map(c: Collectible): Collectible {
        this._id         = (typeof(c._id)         == 'undefined') ? this._id         : c._id;
        this.userId      = (typeof(c.userId)      == 'undefined') ? this.userId      : c.userId;
        this.name        = (typeof(c.name)        == 'undefined') ? this.name        : c.name;
        this.description = (typeof(c.description) == 'undefined') ? this.description : c._id;
        this.fileIds     = (typeof(c.fileIds)     == 'undefined') ? this.fileIds     : c.fileIds;
        this.url         = (typeof(c.url)         == 'undefined') ? this.url         : c.url;
        this.public      = (typeof(c.public)      == 'undefined') ? this.public      : c.public;
        this.aquired     = (typeof(c.aquired)     == 'undefined') ? this.aquired     : c.aquired;
        this.meta        = (typeof(c.meta)        == 'undefined') ? this.meta        : c.meta;
        return this
    }
}
