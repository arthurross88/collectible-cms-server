// Core.
import { Component, Input, Output, 
         ViewChild, OnInit, 
         EventEmitter }                  from '@angular/core';
import { DomSanitizer, SafeStyle }       from '@angular/platform-browser';
// Models.
import { Collectible }                   from '../../../models/collectible';
import { User, CurrentUser }             from '../../../models/user';
import { File }                          from '../../../models/file';
import { AlertMessage }                  from '../../../models/alertMessage';
// Services.
import { CollectibleService }            from '../../../services/collectible/collectible.service';
import { AuthenticateService }           from '../../../services/authenticate/authenticate.service';
// Components.
import { Options as TableOptions }       from '../../../components/files/table/table.component'
import { Options as ImgThumbOptions }    from '../../../components/files/thumbnail/thumbnail.component';

/**
 *  <cc-collectibles-create
 *      [options]="collectibleOptions"
 *      (onAlert)="doAlert($event)">
 *  </cc-collectibles-create>
 */
@Component({
    selector: 'cc-collectibles-create',
    templateUrl: 'create.html',
    styleUrls: ['create.css'],
    providers: [
        CollectibleService
    ]
})
export class CollectibleCreate implements OnInit {
    @Input() options: Options;
    @Output() onAlert = new EventEmitter<AlertMessage>();
    working: boolean = false;
    loaded: boolean = false;
    success: boolean = false;
    collectible: Collectible = new Collectible();
    currentUser: CurrentUser;
    files: File[] = [];
    tableOptions: TableOptions = {
        style: this.sanitizer.bypassSecurityTrustStyle('width: 6em; height: 6em;'),
        rows: 1,
        pagination: {
            pageCurrent: 1,
            maxPageButtons: 1,
            itemsPerPage: 1
        },
        thumbnail: {
            modal: false
        }
    };
    constructor(private authService: AuthenticateService, 
                private collectibleService: CollectibleService,
                private sanitizer: DomSanitizer) { }
    ngOnInit() {
        this.loaded = true;
        this.currentUser = this.authService.getCurrentUser();
        this.collectible.public = true;
    }
    // Event listener for child component.
    doAlert(alert: AlertMessage) {
        this.onAlert.emit(alert);
    }
    // Event listener for child component.
    doFileUpload(file: File) {
        if (this.collectible.fileIds === undefined) {
            this.collectible.fileIds = [];
        }
        this.files.push(file);
        this.collectible.fileIds.push(file._id);
    }
    save() {
        this.working = true;
        this.collectibleService.create(this.currentUser.user, this.collectible).subscribe(
            collectible => { 
                this.collectible = collectible; 
                this.success = true;
                var self = this;
                setTimeout(function() {
                    self.success = false;
                    self.collectible = new Collectible();
                }, 2000);
            },
            err => { this.onAlert.emit({ type: 'error', message: err }); },
            () => { this.working = false; }
        );
    }
};
// Support class.
export class Options {

}
