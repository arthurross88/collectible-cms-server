import { Component, OnInit }        from '@angular/core';
import { ActivatedRoute }           from '@angular/router';
import { User }                     from '../../../models/user';
import { File }                     from '../../../models/file';
import { ImagesTable }              from '../../../components/files/views/images/table/table.component';
import { AlertMessage }             from '../../../models/alertMessage';
import { UserService }              from '../../../services/user/user.service';
import { FileService }              from '../../../services/file/file.service';

@Component({
    moduleId: module.id,
    selector: 'cc-routes-users-profile',
    templateUrl: 'view.html',
    styleUrls: ['style.css'],
    providers: [
        FileService
    ],
    directives: [
        ImagesTable
    ]
})
export class RoutesUsersProfileComponent implements OnInit {
    alerts: AlertMessage[] = [];
    files: File[];
    working: boolean = false;
    loaded: boolean = false;
    userId: string;
    user : User;
    constructor(private route: ActivatedRoute, private userService: UserService,
                private fileService: FileService) {
        this.userId = route.snapshot.params['id'];        
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
        this.fileService.readAll(this.userId).subscribe(
            files => { this.files = files; },
            err => this.alerts.push({ type: 'error', message: err }),
            () => this.working = false
        );
    }
};
