import { Component, Input, Output, ViewChild, OnInit, EventEmitter } from '@angular/core';
import { File }                         from '../../../../../models/file';
import { AlertMessage }                 from '../../../../../models/alertMessage';
import { FileService } from '../../../../../services/file/file.service';
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
    providers: [
        FileService
    ]
})
export class ImagesTable implements OnInit {
    @ViewChild(Pagination) pagination: Pagination;
    @Input() files: File[];
    @Input() options: Options;
    @Output() onAlert = new EventEmitter<AlertMessage>();
    working: boolean = false;
    loaded: boolean = false;
    unique: string = Math.floor(Math.random() * 10000).toString();
    pageCurrent: number = 1;
    lastFileCount = 0;
    constructor(private fileService: FileService) { }
    ngOnInit() { }
    ngOnChanges(changes: Map<string, any>): void {
        if (changes["files"] !== undefined && changes["files"].currentValue !== undefined) {
            this.loaded = true;
            var self = this;
            setTimeout(function() { self.onResize(); });
        }
    }
    ngDoCheck() {
        if (this.files !== undefined && this.files.length != this.lastFileCount) {
            var self = this;
            this.lastFileCount = this.files.length;
            setTimeout(function() { self.onResize(); });
        }
    }
    // Event listener for child component.
    doOnAlert(alert: AlertMessage) {
        this.onAlert.emit(alert);
    }
    doOnFileDelete(file: File) {
        for (var i = 0; i < this.files.length; i++) {
            if (this.files[i]._id == file._id) {
                this.working = true;
                this.fileService.delete(file._id).subscribe(
                    success => {
                        this.files.splice(i, 1);
                    },
                    err => this.onAlert.emit({ type: 'error', message: err }),
                    () => this.working = false
                )
                break;
            }
        }
    }
    // Event listener for child component.
    doOnPageChange(page: number) {
        this.pageCurrent = page;
    }
    // Event listener.
    onResize() {
        if (this.options.rows != null) {
            var total = jQuery(jQuery('.cc-images-table.unique-'+this.unique+' div.loaded')[0]).innerWidth();
            var item  = jQuery(jQuery('.cc-images-table.unique-'+this.unique+' div.files')[0]).outerWidth(true);
            var count = Math.floor(total / item);
            if (isNaN(count)) { count = 1; }
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
