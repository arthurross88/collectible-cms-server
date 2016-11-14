// Core.
import { Component, Input, Output,
         OnInit, EventEmitter, 
         SimpleChanges }                 from '@angular/core';
// Models.
import { File }                          from '../../../models/file';
import { AlertMessage }                  from '../../../models/alertMessage';
import { CurrentUser }                   from '../../../models/user';
// Services.
import { AuthenticateService }           from '../../../services/authenticate/authenticate.service';

declare var jQuery: any;

/**
 *  <cc-file-thumbnail 
 *      [options]="thumbnailOptions" 
 *      [file]="file"
 *      (onAlert)="doOnAlert($event)" 
 *      (onFileDelete)="doOnFileDelete($event)"
 *      (onFileClick)="doOnFileClick($event)">
 *  </cc-file-thumbnail>
 */
@Component({
    selector: 'cc-file-thumbnail',
    templateUrl: 'thumbnail.html',
    styleUrls: ['thumbnail.css'],
})
export class Thumbnail implements OnInit {
    @Input() options: Options;
    @Input() file: File;
    @Output() onAlert = new EventEmitter<AlertMessage>();
    @Output() onFileDelete = new EventEmitter<File>();
    @Output() onFileClick = new EventEmitter<File>();
    currentUser: CurrentUser;
    unique: string = Math.floor(Math.random() * 10000).toString();
    authorized: boolean = false;
    working: boolean = false;
    loaded: boolean = false;
    resizedUrl: string = '';
    constructor(private authService: AuthenticateService) { 
        this.currentUser = this.authService.getCurrentUser();
    }
    ngOnInit() { }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['file'] !== undefined && changes['file'].currentValue !== undefined) {
            this.loaded = true;
            this.authorized = (changes['file'].currentValue.userId == this.currentUser.user._id) || 
                              this.currentUser.user.isAdmin();
        }
    }
    ngAfterContentChecked() {
        // Automatically load in the most efficiently sized image.
        if (!this.resizedUrl.length) {
            let sizePx: string = jQuery('.cc-file-thumbnail.' + this.unique + ' > .inner').css('width');
            if (sizePx !== undefined) {
                let size: number = +sizePx.replace(/[^-\d\.]/g, '');
                let f = this.file;
                if (f !== undefined) {
                    if (size <= 320) {
                        this.resizedUrl = f.baseUrl + '/thumb/' + f.name;
                    } else if (size <= 1024) {
                        this.resizedUrl = f.baseUrl + '/full/' + f.name;
                    } else {
                        this.resizedUrl = f.baseUrl + '/' + f.name;
                    }
                } else {
                    // Include some default image?
                }
            }
        }
    }
    showModal() {
        jQuery('.modal-' + this.unique).modal('show');
    }
    delete() {
        this.onFileDelete.emit(this.file);
    }
    click() {
        if (this.options.modal) {
            this.showModal();
        } else {
            this.onFileClick.emit(this.file);
        }
    }
};

/**
 * Support Classes.
 */
export class Options {
    // Show a modal of image instead of issue onFileClick event.
    modal: boolean;
}
