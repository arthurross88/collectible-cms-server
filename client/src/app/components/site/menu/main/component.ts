import { Component, ViewChild }			 from '@angular/core';
import { OnInit }          				 from '@angular/core';
import { Router }                        from '@angular/router';
import { User, CurrentUser } 			 from '../../../../models/user';
import { AlertMessage }                  from '../../../../models/alertMessage';
import { AuthenticateService }           from '../../../../services/authenticate/authenticate.service';
import { LoginComponent }                from '../../../../components/login/component';

@Component({
    selector: 'cc-site-menu-main',
    templateUrl: 'view.html',
    styleUrls: ['style.css'],
})
export class SiteMenuMainComponent implements OnInit {
    @ViewChild(LoginComponent) loginComponent:LoginComponent;
	currentUser: CurrentUser;
    alerts: AlertMessage[] = [];
    constructor(private authService: AuthenticateService, private router: Router ) { }
    login() {
        this.loginComponent.logIn();
    }
    logout() {
        this.authService.deleteToken().updateCurrentUser();
    }
    closeModal() {
        // Close all alerts.
        this.alerts = [];
    }
    ngOnInit() {
        this.loginComponent.options.display.button = false;
    	this.currentUser = this.authService.getCurrentUser();
    }
};
