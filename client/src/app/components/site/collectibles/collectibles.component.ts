// Core.
import { Component, OnInit, Input, 
         Output, EventEmitter }          from '@angular/core';
// Models.
import { User }                          from '../../../models/user';
import { Collectible }                   from '../../../models/collectible';
import { AlertMessage }                  from '../../../models/alertMessage';
// Services.
import { CollectibleService }            from '../../../services/collectible/collectible.service';
// Components.
import { CollectiblesTable, 
         Options as TableOptions }       from '../../../components/collectibles/table/table.component';
import { Pagination, 
         Options as PaginationOptions }  from '../../../components/site/pagination/pagination.component';

/**
 *  <cc-site-collectibles
 *      [options]="collectiblesOptions"
 *      (onAlert)="doOnAlert($event)">
 *  </cc-site-collectibles>
 */
@Component({
    selector: 'cc-site-collectibles',
    templateUrl: 'collectibles.html',
    styleUrls: ['collectibles.css'],
    providers: [
        CollectibleService
    ]
})
export class SiteCollectibles implements OnInit {
    @Input() user: User;
    @Input() options: Options;
    @Output() onAlert = new EventEmitter<AlertMessage>();
    working: boolean = false;
    loaded: boolean = false;
    collectibles: Collectible[];
    constructor(private collectibleService: CollectibleService) { }
    ngOnInit() { 
        this.getCollectibles();
    }
    getCollectibles() {
        this.working = true;
        this.collectibleService.readAll().subscribe(
            collectibles => { 
                this.collectibles = collectibles; 
                this.loaded = true;
                this.working = false;
            },
            err => {
                this.working = false;
                this.loaded = false;
                this.onAlert.emit({ type: 'error', message: err });
            }
        );
    }
};

/**
 * Support Classes.
 */
export class Options {
    title: string;
    table: TableOptions;
}
