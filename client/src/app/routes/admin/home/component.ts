// Core.
import { Component,  OnInit }            from '@angular/core';
import { DomSanitizer, SafeStyle }       from '@angular/platform-browser';
// Models.
import { AlertMessage }                  from '../../../models/alertMessage';
import { User, CurrentUser }             from '../../../models/user';
// Services.
import { AuthenticateService }           from '../../../services/authenticate/authenticate.service';
import { UserService }                   from '../../../services/user/user.service';
// Components.
import { UsersTable, 
         Options as UserTableOptions }   from '../../../components/users/table/table.component';
import { SiteCollectibles, 
         Options as SiteCollectiblesOptions } from '../../../components/site/collectibles/collectibles.component';

@Component({	
    selector: 'cc-routes-admin-home',
    templateUrl: 'view.html',
    styleUrls: ['style.css']
})

export class RoutesAdminHomeComponent implements OnInit {
	alerts: AlertMessage[] = [];
	currentUser: CurrentUser = null;
    working: boolean = false;
    loaded: boolean = false;
    userTableOptions: UserTableOptions = {
        rows: null,
        pagination: {
            pageCurrent: 1,
            maxPageButtons: 5,
            itemsPerPage: 10
        },
        thumbnail: {
            modal: false
        }
    };
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
    users: User[];
    constructor(private authService: AuthenticateService, 
                private userService: UserService,
                private sanitizer: DomSanitizer) { }
    ngOnInit() {
    	this.currentUser = this.authService.getCurrentUser();
        this.userService.readAll().subscribe(
            users => { 
                this.users = users; 
                this.loaded = true;
            },
            err => { this.alerts.push({ type: 'error', message: err }) },
            () => this.working = false
        );
    }
    doOnAlert(alert: AlertMessage) {
        this.alerts.push(alert);
    }
};
