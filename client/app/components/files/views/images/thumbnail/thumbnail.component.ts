import { Component, Input, Output }     from '@angular/core';
import { OnInit, EventEmitter }         from '@angular/core';
import { File }                         from '../../../../../models/file';
import { AlertMessage }                 from '../../../../../models/alertMessage';

/**
 *  <cc-files-views-images-thumbnail [alerts]="alerts" [file]="file" (onFileDelete)="onDelete($event)">
 *  </cc-files-views-images-thumbnail>
 */
@Component({
    moduleId: module.id,
    selector: 'cc-files-views-images-thumbnail',
    templateUrl: 'thumbnail.html',
    styleUrls: ['thumbnail.css'],
})
export class FilesViewsImagesThumbnailComponent implements OnInit {
    @Input() alerts: AlertMessage[];
    @Input() file: File;
    @Output() onFileDelete = new EventEmitter<File>();
    working: boolean = false;
    loaded: boolean = false;
    constructor() { }
    delete() {
        this.onFileDelete.emit(this.file);
    }
    ngOnInit() {
        this.loaded = true;
    }
};
