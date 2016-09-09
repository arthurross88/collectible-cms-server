import { Component }	                 from '@angular/core';
import { OnInit }		                 from '@angular/core';
import { DomSanitizationService, SafeStyle } from '@angular/platform-browser';
import { AlertMessage }                  from '../../../models/alertMessage';
import { User, CurrentUser }			 from '../../../models/user';
import { Config, ConfigContainer }       from '../../../models/config';
import { AuthenticateService }           from '../../../services/authenticate/authenticate.service';
import { ConfigService }                 from '../../../services/config/config.service';
import { SiteCollectibles, Options as SiteCollectiblesOptions } from '../../../components/site/collectibles/collectibles.component';

@Component({
    moduleId: module.id,	
    selector: 'cc-routes-site-home',
    templateUrl: 'view.html',
    styleUrls: ['style.css'],
    directives: [
        SiteCollectibles
    ]
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
            rows: 2,
            pagination: {
                pageCurrent: 1,
                maxPageButtons: 5,
                itemsPerPage: 10
            },
            thumbnail: {
                style: this.sanitizer.bypassSecurityTrustStyle('width: 12em; height: 12em;')
            }
        }
    }
    constructor(private authService: AuthenticateService, private configService: ConfigService,
                private sanitizer: DomSanitizationService) { }
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
