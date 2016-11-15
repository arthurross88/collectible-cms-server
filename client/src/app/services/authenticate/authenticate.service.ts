import { Injectable }	                from '@angular/core';
import { User, CurrentUser }            from '../../models/user';
import { HttpService }	                from '../http/http.service';

declare var jwt_decode: any;

@Injectable()
export class AuthenticateService {
    jwt_decode: any = jwt_decode;    
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
            var decoded = this.jwt_decode(token);
            // Remove token and current user is token is expired.
            if (Math.floor(Date.now() / 1000) <= decoded.exp) {
                user.map(decoded);
            } else {
                this.deleteToken();
            }
        }
        this.currentUser.user = user;
        return this;
    }
    getCurrentUser() : CurrentUser {
        return this.currentUser;
    }
}
