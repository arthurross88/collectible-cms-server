// Core.
import { Component, Input, Output, 
         OnInit, EventEmitter }          from '@angular/core';
import { DomSanitizer, SafeStyle }       from '@angular/platform-browser';
// Models.
import { Collectible }                   from '../../../models/collectible';
import { User, CurrentUser }             from '../../../models/user';
import { File }                          from '../../../models/file';
import { AlertMessage }                  from '../../../models/alertMessage';
// Services.
import { CollectibleService }            from '../../../services/collectible/collectible.service';
import { AuthenticateService }           from '../../../services/authenticate/authenticate.service';
import { FileService }                   from '../../../services/file/file.service';
// Components.
import { Options as ITableOptions }      from '../../../components/files/table/table.component';

/**
 *  <cc-collectible-edit
 *      [collectible]="collectible"
 *      (onAlert)="doAlert($event)">
 *  </cc-collectibles-edit>
 */
@Component({
    selector: 'cc-collectible-edit',
    templateUrl: 'edit.html',
    styleUrls: ['edit.css'],
    providers: [
        CollectibleService,
        FileService
    ]
})
export class CollectibleEdit implements OnInit {
    @Input() collectible: Collectible;
    @Output() onAlert = new EventEmitter<AlertMessage>();
    working: boolean = false;
    loaded: boolean = false;
    success: boolean = false;
    fail: boolean = false;
    currentUser: CurrentUser;
    files: File[];
    iTableOptions: ITableOptions = {
        style: this.sanitizer.bypassSecurityTrustStyle('width: 6em; height: 6em;'),
        rows: 1,
        pagination: {
            pageCurrent: 1,
            maxPageButtons: 1,
            itemsPerPage: 1
        },
        thumbnail: {
            modal: true
        }
    };
    constructor(private authService: AuthenticateService, 
                private collectibleService: CollectibleService,
                private sanitizer: DomSanitizer,
                private fileService: FileService) { }
    ngOnInit() {
        this.currentUser = this.authService.getCurrentUser();
        this.collectible.public = true;
        this.loaded = true;
    }
    // Event listener for child component.
    doOnAlert(alert: AlertMessage) {
        this.onAlert.emit(alert);
    }
    // Event listener for child component.
    doOnFileUpload(file: File) {
        this.collectible.fileIds = (this.collectible.fileIds === undefined) ? [] : this.collectible.fileIds;
        this.collectible.files   = (this.collectible.files   === undefined) ? [] : this.collectible.files;
        this.collectible.files.push(file);
        this.collectible.fileIds.push(file._id);
        this.onAlert.emit({ type: 'success', message: 'File uploaded.' });
    }
    // Event listener for child component.
    doOnFileDelete(file: File) {
        for (var i = 0; i < this.collectible.files.length; i++) {
            if (this.collectible.files[i]._id == file._id) {
                this.working = true;
                this.fileService.delete(file._id).subscribe(
                    success => {
                        this.collectible.files.splice(i, 1);
                        this.collectible.fileIds.splice(
                            this.collectible.fileIds.indexOf(file._id),
                            1
                        );
                    },
                    err => this.onAlert.emit({ type: 'error', message: err }),
                    () => this.working = false
                )
                break;
            }
        }

    }
    update() {
        var self = this;
        this.working = true;
        this.collectibleService.update(this.currentUser.user, this.collectible).subscribe(
            collectible => { 
                this.collectible = collectible; 
                this.success = true;
                this.working = false;
                setTimeout(function() {
                    self.success = false;
                }, 2000);
            },
            err => { 
                this.onAlert.emit({ type: 'error', message: err });
                this.fail = true;
                this.working = false;
                setTimeout(function() {
                    self.fail = false;
                }, 2000);
            }
        );
    }
};
// Support class.
export class Options {

}
