import { Component, OnInit }             from '@angular/core';
import { ActivatedRoute }                from '@angular/router';
import { User, CurrentUser }             from '../../../models/user';
import { AlertMessage }                  from '../../../models/alertMessage';
import { File }                          from '../../../models/file';
import { Config, ConfigContainer }       from '../../../models/config';
import { ConfigService }                 from '../../../services/config/config.service';
import { UserService }                   from '../../../services/user/user.service';
import { AuthenticateService }           from '../../../services/authenticate/authenticate.service';
import { SiteUploadComponent }           from '../../../components/site/upload/component';

@Component({
    moduleId: module.id,
    selector: 'cc-routes-users-edit',
    templateUrl: 'view.html',
    styleUrls: ['style.css'],
    directives: [ SiteUploadComponent ]
})

export class RoutesUsersEditComponent implements OnInit {
	alerts: AlertMessage[] = [];
    currentUser: CurrentUser;
    configContainer: ConfigContainer;
    working: boolean = false;
    loaded: boolean = false;
    userId: string;
    user : User;
    constructor(private route: ActivatedRoute, private userService: UserService, 
                private authService: AuthenticateService, private configService: ConfigService) {
        this.userId = route.snapshot.params['id'];        
        this.currentUser = authService.getCurrentUser();
        this.configContainer = configService.configContainer;
    }
    changePermission(role: string) {
        var index: number = this.user.roles.indexOf(role);
        if (index > -1) {
            this.user.roles.splice(index, 1);
        } else {
            this.user.roles.push(role);
        }
    }
    save() {
        this.working = true;
        this.userService.update(this.user)
            .subscribe( 
                user => {
                    this.alerts.push({ type: 'success', message: 'Account information udpated.' });
                },
                err => this.alerts.push({ type: 'error', message: err }),
                () => this.working = false
            );
    }
    // Event listener for sub-component.
    onFileUpload(file: File) {
        this.user.image = this.configContainer.config.siteDomain + '/' + file.url;
    }
    ngOnInit() {
        this.working = true;
        this.userService.read(this.userId)
            .subscribe(
                user => {
                    this.user = user;
                    this.loaded = true;
                },
                err => this.alerts.push({ type: 'error', message: err }),
                () => this.working = false
            );
    }
};
