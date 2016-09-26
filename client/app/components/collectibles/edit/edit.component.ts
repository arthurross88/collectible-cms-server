import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Collectible } from '../../../models/collectible';
import { User, CurrentUser } from '../../../models/user';
import { File } from '../../../models/file';
import { AlertMessage } from '../../../models/alertMessage';
import { CollectibleService } from '../../../services/collectible/collectible.service';
import { AuthenticateService } from '../../../services/authenticate/authenticate.service';
import { Options as ITableOptions } from '../../../components/files/views/images/table/table.component'

/**
 *  <cc-collectible-edit
 *      [collectible]="collectible"
 *      (onAlert)="doAlert($event)">
 *  </cc-collectibles-edit>
 */
@Component({
    moduleId: module.id,
    selector: 'cc-collectible-edit',
    templateUrl: 'edit.html',
    styleUrls: ['edit.css'],
    providers: [
        CollectibleService
    ]
})
export class CollectibleEdit implements OnInit {
    @Input() collectible: Collectible;
    @Output() onAlert = new EventEmitter<AlertMessage>();
    working: boolean = false;
    loaded: boolean = false;
    success: boolean = false;
    currentUser: CurrentUser;
    iTableOptions: ITableOptions = {
        rows: 1,
        pagination: {
            pageCurrent: 1,
            maxPageButtons: 1,
            itemsPerPage: 1
        },
        thumbnail: {
            style: "width: 6em; height: 6em;"
        }
    };
    constructor(private authService: AuthenticateService, private collectibleService: CollectibleService) { }
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
        this.collectible.files.push(file);
        this.collectible.fileIds.push(file._id);
    }
    update() {
        this.working = true;
        this.collectibleService.update(this.currentUser.user, this.collectible).subscribe(
            collectible => { 
                this.collectible = collectible; 
                this.success = true;
                var self = this;
            },
            err => { this.onAlert.emit({ type: 'error', message: err }); },
            () => { this.working = false; }
        );
    }
};
// Support class.
export class Options {

}
