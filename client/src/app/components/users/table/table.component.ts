// Core.
import { Component, Input, Output, 
         ViewChild, OnInit, 
         EventEmitter, SimpleChanges }   from '@angular/core';
// Models.
import { File }                          from '../../../models/file';
import { User }                          from '../../../models/user';
import { AlertMessage }                  from '../../../models/alertMessage';
// Services.
import { FileService }                   from '../../../services/file/file.service';
// Components.
import { Pagination, 
         Options as PaginationOptions }  from '../../../components/site/pagination/pagination.component';
import { Options as ImgThumbOptions }    from '../../../components/files/thumbnail/thumbnail.component';

declare var jQuery: any;

/**
 *  <cc-users-table 
 *      [users]="users" 
 *      [options]="tableOptions"
 *      (onAlert)="doOnAlert($event)">
 *  </cc-users-table>
 */
@Component({
    selector: 'cc-users-table',
    templateUrl: 'table.html',
    styleUrls: ['table.css'],
    providers: [
        FileService
    ]
})
export class UsersTable implements OnInit {
    @ViewChild(Pagination) pagination: Pagination;
    @Input() users: User[];
    @Input() options: Options;
    @Output() onAlert = new EventEmitter<AlertMessage>();
    working: boolean = false;
    loaded: boolean = false;
    pageCurrent: number = 1;
    constructor(private fileService: FileService) { }
    ngOnInit() { }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['users'] !== undefined && changes['users'].currentValue !== undefined) {
            this.loaded = true;
            // This can't be right...
            var self = this;
            setTimeout(function() { self.onResize(); });
        }
    }
    // Event listener for child component.
    doOnAlert(alert: AlertMessage) {
        this.onAlert.emit(alert);
    }
    // Event listener for child component.
    doOnPageChange(page: number) {
        this.pageCurrent = page;
    }
    // Event listener.
    onResize() {
        if (this.options.rows != null) {
            var total = jQuery(jQuery('.cc-users-table div.loaded')[0]).innerWidth();
            var item  = jQuery(jQuery('.cc-users-table div.users')[0]).outerWidth(true);
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
    thumbnail: ImgThumbOptions;
};
