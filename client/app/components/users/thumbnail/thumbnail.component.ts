import { Component, Input, Output, ViewChild, OnInit, EventEmitter } from '@angular/core';
import { File } from '../../../models/file';
import { User } from '../../../models/user';
import { AlertMessage } from '../../../models/alertMessage';
import { FileService } from '../../../services/file/file.service';
import { Options as ImgThumbOptions }  from '../../../components/files/views/images/thumbnail/thumbnail.component';

/**
 *  <cc-users-thumbnail
 *      [user]="user" 
 *      [options]="thumbnailOptions"
 *      (onAlert)="doOnAlert($event)">
 *  </cc-users-table>
 */
@Component({
    moduleId: module.id,
    selector: 'cc-users-thumbnail',
    templateUrl: 'thumbnail.html',
    styleUrls: ['thumbnail.css'],
    providers: [
        FileService
    ],
    directives: [
    ]
})
export class UsersThumbnail implements OnInit {
    @Input() user: User;
    @Input() options: Options;
    @Output() onAlert = new EventEmitter<AlertMessage>();
    working: boolean = false;
    loaded: boolean = false;
    file: File;
    constructor(private fileService: FileService) { }
    ngOnInit() { }
    ngOnChanges(changes: Map<string, any>): void {
        if (changes['user'] !== undefined && changes['user'].currentValue !== undefined) {
            if (this.user.imageId !== undefined){
                this.working = true;
                this.fileService.read(this.user.imageId).subscribe(
                    file => { this.file = file; this.loaded = true; },
                    err => { this.onAlert.emit({ type: 'error', message: err }) },
                    () => { this.working = false; }
                );
            }
        }
    }
    // Event listener for child component.
    doOnAlert(alert: AlertMessage) {
        this.onAlert.emit(alert);
    }
};

/**
 * Support classes.
 */
export class Options {
    thumbnail: ImgThumbOptions;
};
