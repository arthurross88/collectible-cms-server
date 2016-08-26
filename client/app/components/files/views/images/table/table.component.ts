import { Component, Input, Output }     from '@angular/core';
import { OnInit, EventEmitter }         from '@angular/core';
import { File }                         from '../../../../../models/file';
import { AlertMessage }                 from '../../../../../models/alertMessage';

/**
 *  <cc-files-views-images-table [alerts]="alerts" [files]="files">
 *  </cc-files-views-images-table>
 */
@Component({
    moduleId: module.id,
    selector: 'cc-files-views-images-table',
    templateUrl: 'table.html',
    styleUrls: ['table.css'],
})
export class FilesViewsImagesTableComponent implements OnInit {
    @Input() alerts: AlertMessage[];
    @Input() files: File[];
    @Output() onFileDelete = new EventEmitter<File>();
    working: boolean = false;
    loaded: boolean = false;
    constructor() { }
    ngOnInit() {
        this.loaded = true;
    }
};
