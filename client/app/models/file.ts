
export class File {
	// File unique identifier.
	_id: string;
	// File name.
	name: string;
	// Relative url path to file. Does not include domain.
	url: string;
	// Absolute path to file on disk.
	path: string;
	// File is private or public.
	public: boolean;
	constructor(file?: File) {
		if (file != null) {
			this.map(file);
		}
	}
	map(file: File): File {
		this._id    = (typeof(file._id)    == 'undefined') ? this._id    : file._id;
		this.name   = (typeof(file.name)   == 'undefined') ? this.name   : file.name;
		this.url    = (typeof(file.url)    == 'undefined') ? this.url    : file.url;
		this.path   = (typeof(file.path)   == 'undefined') ? this.path   : file.path;
		this.public = (typeof(file.public) == 'undefined') ? this.public : file.public;
		return this
	}
}
