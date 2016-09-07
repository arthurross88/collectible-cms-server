import { Component, OnInit }             from '@angular/core';
import { ActivatedRoute }                from '@angular/router';
import { User, CurrentUser }             from '../../../models/user';
import { AlertMessage }                  from '../../../models/alertMessage';
import { File }                          from '../../../models/file';
import { Config, ConfigContainer }       from '../../../models/config';
import { ConfigService }                 from '../../../services/config/config.service';
import { UserService }                   from '../../../services/user/user.service';
import { FileService }                   from '../../../services/file/file.service';
import { AuthenticateService }           from '../../../services/authenticate/authenticate.service';
import { FilesUploadComponent }          from '../../../components/files/upload/upload.component';
import { Thumbnail, 
         Options as ThumbnailOptions }   from '../../../components/files/views/images/thumbnail/thumbnail.component';
import { CollectibleCreate,
         Options as CollectibleOptions } from '../../../components/collectibles/create/create.component';

@Component({
    moduleId: module.id,
    selector: 'cc-routes-users-edit',
    templateUrl: 'view.html',
    styleUrls: ['style.css'],
    providers: [
        FileService
    ],
    directives: [ 
        FilesUploadComponent,
        CollectibleCreate,
        Thumbnail
    ]
})
export class RoutesUsersEditComponent implements OnInit {
	alerts: AlertMessage[] = [];
    currentUser: CurrentUser;
    configContainer: ConfigContainer;
    working: boolean = false;
    loaded: boolean = false;
    userId: string;
    user: User;
    file: File;
    thumbnailOptions: ThumbnailOptions = {
        width: '4em',
        height: '4em'
    };
    collectibleOptions: CollectibleOptions = { };
    constructor(private route: ActivatedRoute, private userService: UserService, 
                private authService: AuthenticateService, private configService: ConfigService,
                private fileService: FileService) {
        this.userId = route.snapshot.params['id'];        
        this.currentUser = authService.getCurrentUser();
        this.configContainer = configService.configContainer;
    }
    ngOnInit() {
        this.working = true;
        this.userService.read(this.userId).subscribe(
            user => {
                this.user = user;
                this.fileService.read(this.user.imageId).subscribe(
                    file => { this.file = file; },
                    err => this.alerts.push({ type: 'error', message: err }),
                    () => { this.loaded = true; this.working = false; }
                );
            },
            err => this.alerts.push({ type: 'error', message: err })
        );
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
    doFileUpload(file: File) {
        this.file = file;
        this.user.imageId = file._id;
    }
    // Event listener for sub-component.
    doAlert(alert: AlertMessage) {
        this.alerts.push(alert);
    }
    // Event listener for sub-component.
    doFileDelete(file: File) {
        console.log('Deleting File!');
    }
};
