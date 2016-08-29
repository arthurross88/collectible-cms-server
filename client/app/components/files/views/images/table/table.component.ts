import { Component, Input, Output, ViewChild, OnInit, EventEmitter } from '@angular/core';
import { File }                         from '../../../../../models/file';
import { AlertMessage }                 from '../../../../../models/alertMessage';
import { Pagination, Options as PaginationOptions } from '../../../../../components/site/pagination/pagination.component';
import { Options as ThumbnailOptions }  from '../../../../../components/files/views/images/thumbnail/thumbnail.component';

declare var jQuery;

/**
 *  <cc-images-table 
 *      [files]="files" 
 *      [options]="tableOptions"
 *      (onAlert)="onDoAlert($event)">
 *  </cc-images-table>
 */
@Component({
    moduleId: module.id,
    selector: 'cc-images-table',
    templateUrl: 'table.html',
    styleUrls: ['table.css'],
    directives: [
        Pagination
    ]
})
export class ImagesTable implements OnInit {
    @ViewChild(Pagination) pagination: Pagination;
    @Input() files: File[];
    @Input() options: Options;
    @Output() onAlert = new EventEmitter<AlertMessage>();
    working: boolean = false;
    loaded: boolean = false;
    pageCurrent: number = 1;
    constructor() { }
    ngOnInit() { }
    ngOnChanges(changes: Map<string, any>): void {
        if (changes["files"] !== undefined && changes["files"].currentValue !== undefined) {
            this.loaded = true;
            // This can't be right...
            var self = this;
            setTimeout(function() { self.onResize(); });
        }
    }
    // Event listener for child component.
    onDoAlert(alert: AlertMessage) {
        this.onAlert.emit(alert);
    }
    // Event listener for child component.
    onDoPageChange(page: number) {
        this.pageCurrent = page;
    }
    // Event listener.
    onResize() {
        if (this.options.rows != null) {
            var total = jQuery(jQuery('.cc-images-table div.loaded')[0]).innerWidth();
            var item  = jQuery(jQuery('.cc-images-table div.files')[0]).outerWidth(true);
            var count = Math.floor(total / item);
            this.options.pagination.itemsPerPage = count * this.options.rows;
            this.pagination.recalculate();
        }
    }
};

/**
 * Support classes.
 */
export class Options {
    rows: number;
    pagination: PaginationOptions;
    thumbnail: ThumbnailOptions;
};
