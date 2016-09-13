import { Component, Input, Output, ViewChild, OnInit, EventEmitter } from '@angular/core';
import { File } from '../../../models/file';
import { Collectible } from '../../../models/collectible';
import { AlertMessage } from '../../../models/alertMessage';
import { CollectibleService } from '../../../services/collectible/collectible.service';
import { Pagination, Options as PaginationOptions } from '../../../components/site/pagination/pagination.component';
import { CollectiblesThumbnail, Options as ThumbnailOptions }  from '../../../components/collectibles/thumbnail/thumbnail.component';

declare var jQuery;

/**
 *  <cc-collectibles-table 
 *      [collectibles]="collectibles" 
 *      [options]="tableOptions"
 *      (onAlert)="onDoAlert($event)">
 *  </cc-collectibles-table>
 */
@Component({
    moduleId: module.id,
    selector: 'cc-collectibles-table',
    templateUrl: 'table.html',
    styleUrls: ['table.css'],
    providers: [
        CollectibleService
    ]
})
export class CollectiblesTable implements OnInit {
    @ViewChild(Pagination) pagination: Pagination;
    @Input() collectibles: Collectible[];
    @Input() options: Options;
    @Output() onAlert = new EventEmitter<AlertMessage>();
    working: boolean = false;
    loaded: boolean = false;
    unique: string = Math.floor(Math.random() * 10000).toString();
    pageCurrent: number = 1;
    lastCollectibleCount = 0;
    constructor(private collectibleService: CollectibleService) { }
    ngOnInit() { }
    ngOnChanges(changes: Map<string, any>): void {
        if (changes["collectibles"] !== undefined && changes["collectibles"].currentValue !== undefined) {
            this.loaded = true;
            // This can't be right...
            var self = this;
            setTimeout(function() { self.onResize(); });
        }
    }
    ngDoCheck() {
        if (this.collectibles !== undefined && this.collectibles.length != this.lastCollectibleCount) {
            var self = this;
            setTimeout(function() { self.onResize(); });
        }
    }
    // Event listener for child component.
    doOnAlert(alert: AlertMessage) {
        this.onAlert.emit(alert);
    }
    doOnCollectbileDelete(c: Collectible) {
        for (var i = 0; i < this.collectibles.length; i++) {
            if (this.collectibles[i]._id == c._id) {
                this.working = true;
                this.collectibleService.delete(c._id).subscribe(
                    success => {
                        this.collectibles.splice(i, 1);
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
            var total = jQuery(jQuery('.cc-collectibles-table.unique-'+this.unique+' div.loaded')[0]).innerWidth();
            var item  = jQuery(jQuery('.cc-collectibles-table.unique-'+this.unique+' div.collectibles')[0]).outerWidth(true);
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
