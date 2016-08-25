import { Component }	                 from '@angular/core';
import { OnInit }		                 from '@angular/core';
import { AlertMessage }                  from '../../../models/alertMessage';
import { User, CurrentUser }			 from '../../../models/user';
import { Config, ConfigContainer }       from '../../../models/config';
import { AuthenticateService }           from '../../../services/authenticate/authenticate.service';
import { ConfigService }                 from '../../../services/config/config.service';

@Component({
    moduleId: module.id,	
    selector: 'cc-routes-site-home',
    templateUrl: 'view.html',
    styleUrls: ['style.css'],
})

export class RoutesSiteHomeComponent implements OnInit {
	alerts: AlertMessage[] = [];
	currentUser: CurrentUser = null;
    configContainer: ConfigContainer = new ConfigContainer();
    loaded = false;
    working = false;
    constructor(private authService: AuthenticateService, private configService: ConfigService) {
    }
    ngOnInit() {
    	this.currentUser = this.authService.getCurrentUser();
        this.configService.read().subscribe(
            configContainer => {
                this.configContainer = configContainer;
                this.loaded = true;
            },
            err => { this.alerts.push({ type: 'error', message: err }); },
            () => { this.working = false; }
        );
    }
};
