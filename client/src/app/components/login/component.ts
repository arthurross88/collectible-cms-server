import { Component, Input, OnInit }      from '@angular/core';
import { User }                          from '../../models/user';
import { AlertMessage }                  from '../../models/alertMessage';
import { UserService }                   from '../../services/user/user.service';
import { AuthenticateService }	         from '../../services/authenticate/authenticate.service';

@Component({
    selector: 'cc-login',
    templateUrl: 'view.html',
    styleUrls: ['style.css'],
})
export class LoginComponent implements OnInit {
    @Input() alerts: AlertMessage[];
    public options: Options = new Options();
	name: string;
	password: string;
    working: boolean = false;
    constructor(private authService: AuthenticateService, private userService: UserService) { }
    logIn() {
        this.working = true;
    	this.authService.authenticate(this.name, this.password)
	    .subscribe(
			token => {
                this.authService.setToken(token).updateCurrentUser();
                this.alerts.push({ type: 'success', message: 'Your are now logged in.' });
                window.location.reload();
            },
		    err => { this.alerts.push({ type: 'error', message: err }); },
		    () => { this.working = false; }
		);
    }
    ngOnInit() {
    }
};

class Options {
    display: OptionsDisplay
    constructor() {
        this.display = new OptionsDisplay();
    }
};

class OptionsDisplay {
    button: boolean;
    constructor() {
        this.button = true;
    }
};
