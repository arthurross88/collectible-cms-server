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

@Component({
    moduleId: module.id,
    selector: 'cc-routes-users-profile',
    templateUrl: 'view.html',
    styleUrls: ['style.css'],
    providers: [
        FileService
    ],
    directives: [
        UserImages
    ]
})
export class RoutesUsersProfileComponent implements OnInit {
    alerts: AlertMessage[] = [];
    files: File[];
    working: boolean = false;
    loaded: boolean = false;
    userId: string;
    user : User;
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
