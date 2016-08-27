import { Component, Input, Output }     from '@angular/core';
import { OnInit, EventEmitter }         from '@angular/core';
import { ViewChild }                    from '@angular/core';
import { File }                         from '../../../../../models/file';
import { AlertMessage }                 from '../../../../../models/alertMessage';
import { SitePaginationComponent as Pagination,
         Options as PaginationOptions } from '../../../../../components/site/pagination/pagination.component';

/**
 *  <cc-files-views-images-table [alerts]="alerts" [files]="files"></cc-files-views-images-table>
 */
@Component({
    moduleId: module.id,
    selector: 'cc-files-views-images-table',
    templateUrl: 'table.html',
    styleUrls: ['table.css'],
    directives: [
        Pagination
    ]
})
export class FilesViewsImagesTableComponent implements OnInit {
    @ViewChild(Pagination) pagination: Pagination;
    @Input() alerts: AlertMessage[];
    @Input() files: File[];
    @Output() onFileDelete = new EventEmitter<File>();
    options: Options = new Options();
    working: boolean = false;
    loaded: boolean = false;
    pageCurrent: number = 1;
    paginationOptions: PaginationOptions = {
        pageCurrent: 1,
        maxPageButtons: 5,
        itemsPerPage: 1,
        items: this.files
    }
    constructor() { }
    ngOnInit() { }
    ngOnChanges(changes: Map<string, any>): void {
        if (changes["files"] !== undefined && changes["files"].currentValue !== undefined) {
            this.loaded = true;
            this.paginationOptions.items = this.files;
        }
    }
    onAlert(alert: AlertMessage) {
        this.alerts.push(alert);
    }
    onPageChange(page: number) {
        this.pageCurrent = page;
    }
};

/**
 * Support classes.
 */
class Options {
};
