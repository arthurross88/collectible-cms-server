import { Name }	from './name';

export class User {
	_id: string;
	name: Name;
	email: string;
	password: string;
	image: string;
	roles: [ string ];
	constructor(user?: User) {
		this.name = new Name();
		if (user != null) {
			this.map(user);
		}
	}
	map(user: User): User {
		this._id = (typeof(user._id) == 'undefined') ? this._id : user._id;
		this.email = (typeof(user.email) == 'undefined') ? this.email : user.email;
		this.password = (typeof(user.password) == 'undefined') ? this.password : user.password;
		this.roles = (typeof(user.roles) == 'undefined') ? this.roles : user.roles;
		this.name = (typeof(user.name) == 'undefined') ? this.name : user.name;
		this.image = (typeof(user.image) == 'undefined') ? this.image : user.image;
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
