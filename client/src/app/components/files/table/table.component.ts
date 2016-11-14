// Core.
import { Component, Input, Output, 
         ViewChild, OnInit, 
         EventEmitter, SimpleChanges }   from '@angular/core';
import { SafeStyle }                     from '@angular/platform-browser';
// Models.
import { File }                          from '../../../models/file';
import { AlertMessage }                  from '../../../models/alertMessage';
// Services.
import { FileService }                   from '../../../services/file/file.service';
// Components.
import { Pagination, 
         Options as PaginationOptions }  from '../../../components/site/pagination/pagination.component';
import { Options as IThumbnailOptions }  from '../../../components/files/thumbnail/thumbnail.component';

declare var jQuery: any;

/**
 *  <cc-file-table 
 *      [files]="files" 
 *      [options]="fTableOptions"
 *      (onFileDelete)="doOnFileDelete($event)"
 *      (onAlert)="doOnAlert($event)">
 *  </cc-file-table>
 */
@Component({
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
    @Output() onFileDelete = new EventEmitter<File>();
    working: boolean = false;
    loaded: boolean = false;
    unique: string = Math.floor(Math.random() * 10000).toString();
    pageCurrent: number = 1;
    lastFileCount = 0;
    constructor(private fileService: FileService) { }
    ngOnInit() { }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['files'] !== undefined && changes['files'].currentValue !== undefined) {
            var self = this;
            this.loaded = true;
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
        this.onFileDelete.emit(file);
    }
    // Event listener for child component.
    doOnPageChange(page: number) {
        var self = this;
        this.pageCurrent = page;
        // Why?
        setTimeout(function() {
            self.onResize();
        });
    }
    // Event listener.
    onResize() {
        if (this.options.rows != null) {
            var total = jQuery(jQuery('.cc-images-table.unique-' + this.unique + ' div.loaded')[0]).innerWidth();
            var item  = jQuery(jQuery('.cc-images-table.unique-' + this.unique + ' div.files')[0]).outerWidth(true);
            var count = Math.floor(total / item);
            if (isNaN(count) || count < 1) { count = 1; }
            this.options.pagination.itemsPerPage = count * this.options.rows;
            this.pagination.recalculate();
        }
    }
};

/**
 * Support classes.
 */
export class Options {
    // Apply style to inner container of component. I.E:
    // this.sanitizer.bypassSecurityTrustStyle('width: 6em; height: 6em;'),
    style: SafeStyle;
    rows: number;
    pagination: PaginationOptions;
    thumbnail: IThumbnailOptions;
};
