
export class File {
	_id: number;
	name: string;
	url: string;
	constructor(file?: File) {
		if (file != null) {
			this.map(file);
		}
	}
	map(file: File): File {
		this._id  = (typeof(file._id)  == 'undefined') ? this._id  : file._id;
		this.name = (typeof(file.name) == 'undefined') ? this.name : file.name;
		this.url  = (typeof(file.url)  == 'undefined') ? this.url  : file.url;
		return this
	}
}
