import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Models.
import { User } from '../../../models/user';
import { File } from '../../../models/file';
import { AlertMessage } from '../../../models/alertMessage';
// Services.
import { UserService } from '../../../services/user/user.service';
import { FileService } from '../../../services/file/file.service';
// Components.
import { UserImages, Options as UserImagesOptions } from '../../../components/users/images/images.component';
import { UsersTile, Options as UserTileOptions } from '../../../components/users/tile/tile.component';
import { UserCollectibles, Options as CollectiblesOptions } from '../../../components/users/collectibles/collectibles.component';

@Component({
    moduleId: module.id,
    selector: 'cc-routes-users-profile',
    templateUrl: 'view.html',
    styleUrls: ['style.css'],
    providers: [
        FileService
    ],
    directives: [
        UserImages,
        UserCollectibles,
        UsersTile
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
        title: "",
        table: {
            rows: null,
            pagination: {
                pageCurrent: 1,
                maxPageButtons: 5,
                itemsPerPage: 10
            },
            thumbnail: {
                width: '8em',
                height: '8em'
            }
        }
    };
    userImagesOptions: UserImagesOptions = {
        title: "",
        table: {
            rows: 1,
            pagination: {
                pageCurrent: 1,
                maxPageButtons: 5,
                itemsPerPage: 2
            },
            thumbnail: {
                width: '4em',
                height: '4em'
            }
        }
    };
    tileOptions: UserTileOptions = {
    };
    constructor(private route: ActivatedRoute, private userService: UserService,
                private fileService: FileService) {
        this.userId = route.snapshot.params['id'];        
    }
    ngOnInit() {
        this.working = true;
        this.userService.read(this.userId).subscribe(
            user => {
                this.user = user;
                this.userImagesOptions.title = this.user.alias + '\'s Recent Images';
                this.collectiblesOptions.title = this.user.alias + '\'s Recent Collectibles';
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
