// Core.
import { Component, Input, Output, 
         ViewChild, OnInit, 
         EventEmitter, HostListener, 
         SimpleChanges }                 from '@angular/core';
import { SafeStyle }                     from '@angular/platform-browser';
// Models.
import { File }                          from '../../../models/file';
import { Collectible }                   from '../../../models/collectible';
import { AlertMessage }                  from '../../../models/alertMessage';
// Services.
import { CollectibleService }            from '../../../services/collectible/collectible.service';
// Components.
import { Pagination, 
         Options as PaginationOptions }  from '../../../components/site/pagination/pagination.component';
import { Options as iThumbOptions }      from '../../../components/files/thumbnail/thumbnail.component';

declare var jQuery: any;

/**
 *  <cc-collectibles-table 
 *      [collectibles]="collectibles" 
 *      [options]="cTableOptions"
 *      (onAlert)="doOnAlert($event)">
 *  </cc-collectibles-table>
 */
@Component({
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
    ngOnChanges(changes: SimpleChanges): void {
        if (changes["collectibles"] !== undefined && changes["collectibles"].currentValue !== undefined) {
            this.loaded = true;
            var self = this;
            setTimeout(function() { self.doOnResize(); });
        }
    }
    ngDoCheck() {
        if (this.collectibles !== undefined && this.collectibles.length != this.lastCollectibleCount) {
            var self = this;
            this.lastCollectibleCount = this.collectibles.length;
            setTimeout(function() { self.doOnResize(); });
        }
    }
    // Event listener for child component.
    doOnAlert(alert: AlertMessage) {
        this.onAlert.emit(alert);
    }
    doOnCollectibleDelete(c: Collectible) {
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
    doOnResize() {
        if (this.options.rows != null) {
            var total = jQuery(jQuery('.cc-collectibles-table.unique-'+this.unique+' div.loaded')[0]).innerWidth();
            var item  = jQuery(jQuery('.cc-collectibles-table.unique-'+this.unique+' div.collectibles')[0]).outerWidth(true);
            var count = Math.floor(total / item);
            if (isNaN(count)) { count = 1; }
            this.options.pagination.itemsPerPage = count * this.options.rows;
            this.pagination.recalculate();
        }
    }
    // Event listener. Calculate new number of items to be displayed by pagination.
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.doOnResize();
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
    thumbnail: iThumbOptions;
};
