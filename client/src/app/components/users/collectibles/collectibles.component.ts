// Core
import { Component, OnInit, Input,
         Output, EventEmitter,
         SimpleChanges }                 from '@angular/core';
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
 *  <cc-user-collectibles
 *      [user]="user" 
 *      [options]="collectiblesOptions"
 *      (onAlert)="doOnAlert($event)">
 *  </cc-user-collectibles>
 */
@Component({
    selector: 'cc-user-collectibles',
    templateUrl: 'collectibles.html',
    styleUrls: ['collectibles.css'],
    providers: [
        CollectibleService
    ]
})
export class UserCollectibles implements OnInit {
    @Input() user: User;
    @Input() options: Options;
    @Output() onAlert = new EventEmitter<AlertMessage>();
    working: boolean = false;
    loaded: boolean = false;
    collectibles: Collectible[];
    constructor(private collectibleService: CollectibleService) { }
    ngOnInit() { }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes["user"] !== undefined && changes["user"].currentValue !== undefined) {
            this.getCollectibles();
        }
    }
    getCollectibles() {
        this.working = true;
        this.collectibleService.readAll(this.user._id).subscribe(
            collectibles => { 
                this.collectibles = collectibles; 
                this.loaded = true; 
            },
            err => this.onAlert.emit({ type: 'error', message: err }),
            () => this.working = false
        );
    }
};

/**
 * Support Classes.
 */
export class Options {
    table: TableOptions;
}
