import { Component, ViewChild }			 from '@angular/core';
import { OnInit, Input }   				 from '@angular/core';
import { Router }                        from '@angular/router';
import { User, CurrentUser } 			 from '../../../models/user';
import { AlertMessage }                  from '../../../models/alertMessage';
import { Config, ConfigContainer }       from '../../../models/config';
import { AuthenticateService }           from '../../../services/authenticate/authenticate.service';
import { ConfigService }                 from '../../../services/config/config.service';

@Component({
    selector: 'cc-site-config',
    templateUrl: 'view.html',
    styleUrls: ['style.css'],
})

export class SiteConfigComponent implements OnInit {
    @Input() alerts: AlertMessage[];
	currentUser: CurrentUser;
    configContainer: ConfigContainer;
    working: boolean = false;
    constructor(private authService: AuthenticateService, private router: Router, private configService: ConfigService ) { }
    save() {
        this.working = true;
        this.configService.update(this.configContainer.config).subscribe(
            config => { 
                this.alerts.push({ type: 'success', 'message': 'Configuration updated.' });
            },
            err => { this.alerts.push({ type: 'error', message: err }); },
            () => { this.working = false; }
        );
    }
    ngOnInit() {
        this.working = true;
    	this.currentUser = this.authService.getCurrentUser();
        this.configService.read().subscribe(
            configContainer => { this.configContainer = configContainer; },
            err => { this.alerts.push({ type: 'error', message: err }); },
            () => { this.working = false; }
        );
    }
};
