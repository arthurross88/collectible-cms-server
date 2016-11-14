// Core.
import { Component, Input, Output, 
         ViewChild, OnInit, 
         EventEmitter, SimpleChanges }   from '@angular/core';
import { DomSanitizer, SafeStyle }       from '@angular/platform-browser';
// Models.
import { Collectible }                   from '../../../models/collectible';
import { User, CurrentUser }             from '../../../models/user';
import { File }                          from '../../../models/file';
import { AlertMessage }                  from '../../../models/alertMessage';
// Services.
import { CollectibleService }            from '../../../services/collectible/collectible.service';
import { FileService }                   from '../../../services/file/file.service';
import { AuthenticateService }           from '../../../services/authenticate/authenticate.service';
// Components.
import { Options as TableOptions }       from '../../../components/files/table/table.component'
import { Options as ImgThumbOptions }    from '../../../components/files/thumbnail/thumbnail.component';

/**
 *  <cc-collectibles-full
 *      [collectible]="collectible"
 *      [options]="collectibleOptions"
 *      (onAlert)="doAlert($event)">
 *  </cc-collectibles-full>
 */
@Component({
    selector: 'cc-collectibles-full',
    templateUrl: 'full.html',
    styleUrls: ['full.css'],
    providers: [
        CollectibleService,
        FileService
    ]
})
export class CollectibleFull implements OnInit {
    @Input() collectible: Collectible;
    @Input() options: Options;
    @Output() onAlert = new EventEmitter<AlertMessage>();
    working: boolean = false;
    loaded: boolean = false;
    success: boolean = false;
    currentUser: CurrentUser;
    files: File[] = [];
    tableOptions: TableOptions = {
        style: this.sanitizer.bypassSecurityTrustStyle('width: 100%; border-radius: 30px;'),
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
                private fileService: FileService, 
                private sanitizer: DomSanitizer) { }
    ngOnInit() {
        this.currentUser = this.authService.getCurrentUser();
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['collectible'] !== undefined && changes['collectible'].currentValue !== undefined) {
            this.loaded = true;
        }
    }
    // Event listener for child component.
    doOnAlert(alert: AlertMessage) {
        this.onAlert.emit(alert);
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
