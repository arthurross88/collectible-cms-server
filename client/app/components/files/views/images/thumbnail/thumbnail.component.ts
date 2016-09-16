import { Component, Input, Output }     from '@angular/core';
import { OnInit, EventEmitter }         from '@angular/core';
import { DomSanitizer }                 from '@angular/platform-browser';
import { File }                         from '../../../../../models/file';
import { AlertMessage }                 from '../../../../../models/alertMessage';
import { CurrentUser }                  from '../../../../../models/user';
import { AuthenticateService }          from '../../../../../services/authenticate/authenticate.service';

declare var jQuery;

/**
 *  <cc-thumbnail 
 *      [options]="thumbnailOptions" 
 *      [file]="file"
 *      (onAlert)="doOnAlert($event)" 
 *      (onFileDelete)="doOnFileDelete($event)">
 *  </cc-thumbnail>
 */
@Component({
    moduleId: module.id,
    selector: 'cc-thumbnail',
    templateUrl: 'thumbnail.html',
    styleUrls: ['thumbnail.css'],
})
export class Thumbnail implements OnInit {
    @Input() options: Options;
    @Input() file: File;
    @Output() onAlert = new EventEmitter<AlertMessage>();
    @Output() onFileDelete = new EventEmitter<File>();
    currentUser: CurrentUser;
    unique: number = Math.floor(Math.random() * 10000);
    authorized: boolean = false;
    working: boolean = false;
    loaded: boolean = false;
    constructor(private sanitizer: DomSanitizer, private authService: AuthenticateService) { 
        this.currentUser = this.authService.getCurrentUser();
    }
    ngOnInit() { }
    ngOnChanges(changes: Map<string, any>): void {
        if (changes["file"] !== undefined && changes["file"].currentValue !== undefined) {
            this.loaded = true;
            this.authorized = (changes['file'].currentValue.userId == this.currentUser.user._id) || 
                              this.currentUser.user.isAdmin();
        }
    }
    getStyle() {
        if (this.options.width) {
            return this.sanitizer.bypassSecurityTrustStyle(
                'max-width:' + this.options.width + ';' + 
                'max-height:' + this.options.height + ';'
            );
        }
    }
    showModal() {
        jQuery('.modal-' + this.unique).modal('show');
    }
    delete() {
        this.onFileDelete.emit(this.file);
    }
};

/**
 * Support Classes.
 */
export class Options {
    // Width constraint of image. e.g. '2em'
    width: string;
    // Height constaint of image. e.g. '2em'
    height: string;
}
