import { Component, OnInit }             from '@angular/core';
import { ActivatedRoute }                from '@angular/router';
import { DomSanitizer, SafeStyle }       from '@angular/platform-browser';
// Models.
import { User }                          from '../../../models/user';
import { File }                          from '../../../models/file';
import { AlertMessage }                  from '../../../models/alertMessage';
// Services.
import { UserService }                   from '../../../services/user/user.service';
import { FileService }                   from '../../../services/file/file.service';
// Components.
import { UserImages, 
         Options as UserImagesOptions }  from '../../../components/users/images/images.component';
import { UsersTile, 
         Options as UserTileOptions }    from '../../../components/users/tile/tile.component';
import { UserCollectibles, 
         Options as CollectiblesOptions } from '../../../components/users/collectibles/collectibles.component';

@Component({
    selector: 'cc-routes-users-profile',
    templateUrl: 'view.html',
    styleUrls: ['style.css'],
    providers: [
        FileService
    ]
})
export class RoutesUsersProfileComponent implements OnInit {
    alerts: AlertMessage[] = [];
    files: File[];
    working: boolean = false;
    loaded: boolean = false;
    userId: string;
    user : User;
    collectiblesOptions: CollectiblesOptions = {
        table: {
            style: this.sanitizer.bypassSecurityTrustStyle('width: 10em; border-radius: 8px;'),
            rows: null,
            pagination: {
                pageCurrent: 1,
                maxPageButtons: 5,
                itemsPerPage: 10
            },
            thumbnail: {
                modal: false
            }
        }
    };
    userImagesOptions: UserImagesOptions = {
        title: "",
        table: {
            style: this.sanitizer.bypassSecurityTrustStyle('width: 8em;'),
            rows: 1,
            pagination: {
                pageCurrent: 1,
                maxPageButtons: 5,
                itemsPerPage: 2
            },
            thumbnail: {
                modal: false
            }
        }
    };
    tileOptions: UserTileOptions = {
    };
    constructor(private route: ActivatedRoute, 
                private userService: UserService,
                private fileService: FileService, 
                private sanitizer: DomSanitizer) {
        this.userId = route.snapshot.params['id'];        
    }
    ngOnInit() {
        this.working = true;
        this.userService.read(this.userId).subscribe(
            user => {
                this.user = user;
                this.userImagesOptions.title = (this.user.alias || this.user.email) + '\'s Recent Images';
                this.loaded = true;
            },
            err => this.alerts.push({ type: 'error', message: err }),
            () => this.working = false
        );
    }
    onDoAlert(alert: AlertMessage) {
        this.alerts.push(alert);
    }
};
