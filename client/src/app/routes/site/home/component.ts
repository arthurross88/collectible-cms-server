// Core.
import { Component, OnInit }	         from '@angular/core';
import { DomSanitizer, SafeStyle }       from '@angular/platform-browser';
// Models.
import { AlertMessage }                  from '../../../models/alertMessage';
import { User, CurrentUser }			 from '../../../models/user';
import { Config, ConfigContainer }       from '../../../models/config';
// Services.
import { AuthenticateService }           from '../../../services/authenticate/authenticate.service';
import { ConfigService }                 from '../../../services/config/config.service';
// Components.
import { SiteCollectibles, 
         Options as SiteCollectiblesOptions } from '../../../components/site/collectibles/collectibles.component';

@Component({
    templateUrl: 'view.html',
    styleUrls: ['style.css']
})
export class RoutesSiteHomeComponent implements OnInit {
	alerts: AlertMessage[] = [];
	currentUser: CurrentUser = null;
    configContainer: ConfigContainer = new ConfigContainer();
    loaded = false;
    working = false;
    collectiblesOptions: SiteCollectiblesOptions = {
        title: "Recent Collectibles",
        table: {
            style: this.sanitizer.bypassSecurityTrustStyle('width: 10em; border-radius: 8px;'),
            rows: 2,
            pagination: {
                pageCurrent: 1,
                maxPageButtons: 5,
                itemsPerPage: 10
            },
            thumbnail: {
                modal: false
            }
        }
    }
    constructor(private authService: AuthenticateService, 
                private configService: ConfigService,
                private sanitizer: DomSanitizer) { }
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
    doOnAlert(alert: AlertMessage) {
        this.alerts.push(alert);
    }
};
