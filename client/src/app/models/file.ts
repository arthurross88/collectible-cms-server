
export class File {
	// File unique identifier.
	_id: string;
	// User id.
	userId: string;
	// File name.
	name: string;
	// Relative url path to file. Does not include domain.
	baseUrl: string;
	// File is private or public.
	public: boolean;
	constructor(file?: File) {
		if (file != null) {
			this.map(file);
		}
	}
	map(f: File): File {
		this._id     = (typeof(f._id)     == 'undefined') ? this._id     : f._id;
		this.userId  = (typeof(f.userId)  == 'undefined') ? this.userId  : f.userId;
		this.name    = (typeof(f.name)    == 'undefined') ? this.name    : f.name;
		this.baseUrl = (typeof(f.baseUrl) == 'undefined') ? this.baseUrl : f.baseUrl;
		this.public  = (typeof(f.public)  == 'undefined') ? this.public  : f.public;
		return this
	}
}
