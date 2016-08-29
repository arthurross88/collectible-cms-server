import { Component, Input, Output }     from '@angular/core';
import { OnInit, EventEmitter }         from '@angular/core';
import { DomSanitizationService }       from '@angular/platform-browser';
import { File }                         from '../../../../../models/file';
import { AlertMessage }                 from '../../../../../models/alertMessage';

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
    unique: number = Math.floor(Math.random() * 10000);
    working: boolean = false;
    loaded: boolean = false;
    constructor(private sanitizer: DomSanitizationService) { }
    ngOnInit() { }
    ngOnChanges(changes: Map<string, any>): void {
        if (changes["file"] !== undefined && changes["file"].currentValue !== undefined) {
            this.loaded = true;
        }
    }
    getStyle() {
        return this.sanitizer.bypassSecurityTrustStyle(
            'width:' + this.options.width + ';' + 
            'height:' + this.options.height + ';'
        );
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
