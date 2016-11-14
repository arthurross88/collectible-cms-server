import { Name }	from './name';

export class User {
	_id: string;
	name: Name;
	alias: string;
	url: string;
	email: string;
	password: string;
	profile: string;
	imageId: string;
	roles: [ string ];
	constructor(user?: User) {
		this.name = new Name();
		if (user != null) {
			this.map(user);
		}
	}
	map(u: User): User {
		this._id      = (typeof(u._id)      == 'undefined') ? this._id      : u._id;
		this.email    = (typeof(u.email)    == 'undefined') ? this.email    : u.email;
		this.password = (typeof(u.password) == 'undefined') ? this.password : u.password;
		this.roles    = (typeof(u.roles)    == 'undefined') ? this.roles    : u.roles;
		this.profile  = (typeof(u.profile)  == 'undefined') ? this.profile  : u.profile;
		this.name     = (typeof(u.name)     == 'undefined') ? this.name     : u.name;
		this.alias    = (typeof(u.alias)    == 'undefined') ? this.alias    : u.alias;
		this.url      = (typeof(u.url)      == 'undefined') ? this.url      : u.url;
		this.imageId  = (typeof(u.imageId)  == 'undefined') ? this.imageId  : u.imageId;
		return this
	}
	isRegistered(): boolean {
		if (this._id != null && this._id != "0") {
			return true;
		}
		return false;
	};
	hasRole(role: string) : boolean {
		var hasRole = false;
		if (this.isRegistered() && this.roles.indexOf(role) > -1) {
			hasRole = true;
		}
		return hasRole;
	}
	isAdmin(): boolean {
		return this.hasRole('admin');
	}
	isUser(): boolean {
		return this.hasRole('user');
	}
	isAnonymous(): boolean {
		return this.hasRole('anonymous');
	}
}

export class CurrentUser {
	user: User;
}
