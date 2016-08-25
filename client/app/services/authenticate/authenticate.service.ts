import { Injectable }	                from '@angular/core';
import { Headers }		                from '@angular/http';
import { User, CurrentUser }            from '../../models/user';
import { HttpService }	                from '../http/http.service';

declare var jwt_decode: any;

@Injectable()
export class AuthenticateService {
    currentUser: CurrentUser = new CurrentUser();
    constructor(private httpService: HttpService) { 
        if (typeof(this.currentUser.user) == 'undefined' || this.currentUser.user == null) {
            this.currentUser.user = new User ();
        }
        this.updateCurrentUser();
    }
    /**
     * Request authentication and return JWT in observable.
     *
     * @example
     *     AuthService.authenticate(name, password)
     *     .subscribe(
     *         token => console.log("success: " + token),
     *         err => console.log("error: " + err),
     *         () => console.log('Authentication Complete')
     *     );
     */
    authenticate(email: string, password: string) {
    	var authenticate = {
    		email: email,
    		password: password
    	};
		return this.httpService.postSimple('/api/v1/authenticate', authenticate)
            .map( (json) => { return json.token; });
    }
    getToken() {
    	return localStorage.getItem('token');
    }
    setToken(token: string) : AuthenticateService {
		if (token) {
			localStorage.setItem('token', token);
		}
        return this;
    }
    deleteToken() : AuthenticateService {
        localStorage.removeItem('token');
        return this;
    }
    updateCurrentUser() : AuthenticateService {
        var token: string = this.getToken();
        var user: User = new User();
        if (typeof(token) != 'undefined' && token != null) {
            var decoded = jwt_decode(token);
            user._id = decoded._id;
            user.email = decoded.email;
            user.name = decoded.name;
            user.roles = decoded.roles;
        }
        this.currentUser.user = user;
        return this;
    }
    getCurrentUser() : CurrentUser {
        return this.currentUser;
    }
}
