import { Component }	                 from '@angular/core';
import { OnInit }		                 from '@angular/core';
import { AlertMessage }                  from '../../../models/alertMessage';
import { User, CurrentUser }             from '../../../models/user';
import { AuthenticateService }           from '../../../services/authenticate/authenticate.service';

@Component({
    moduleId: module.id,	
    selector: 'cc-routes-admin-home',
    templateUrl: 'view.html',
    styleUrls: ['style.css'],
})

export class RoutesAdminHomeComponent implements OnInit {
	alerts: AlertMessage[] = [];
	currentUser: CurrentUser = null;
    constructor(private authService: AuthenticateService) {
    }
    ngOnInit() {
    	this.currentUser = this.authService.getCurrentUser();
    }
};
