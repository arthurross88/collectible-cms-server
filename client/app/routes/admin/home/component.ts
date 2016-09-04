import { Component }	                 from '@angular/core';
import { OnInit }		                 from '@angular/core';
import { AlertMessage }                  from '../../../models/alertMessage';
import { User, CurrentUser }             from '../../../models/user';
import { AuthenticateService }           from '../../../services/authenticate/authenticate.service';
import { UserService } from '../../../services/user/user.service';
import { UsersTable, Options as UserTableOptions } from '../../../components/users/table/table.component';

@Component({
    moduleId: module.id,	
    selector: 'cc-routes-admin-home',
    templateUrl: 'view.html',
    styleUrls: ['style.css'],
    directives: [
        UsersTable
    ]
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
            width: '4em',
            height: '4em'
        }
    }
    users: User[];
    constructor(private authService: AuthenticateService, private userService: UserService) {
    }
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
