import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../models/user';
import { Collectible } from '../../../models/collectible';
import { AlertMessage } from '../../../models/alertMessage';
import { CollectibleService } from '../../../services/collectible/collectible.service';
import { CollectiblesTable, Options as TableOptions } from '../../../components/collectibles/table/table.component';
import { Pagination, Options as PaginationOptions } from '../../../components/site/pagination/pagination.component';

/**
 *  <cc-user-collectibles
 *      [user]="user" 
 *      [options]="collectiblesOptions"
 *      (onAlert)="onDoAlert($event)">
 *  </cc-user-collectibles>
 */
@Component({
    moduleId: module.id,
    selector: 'cc-user-collectibles',
    templateUrl: 'collectibles.html',
    styleUrls: ['collectibles.css'],
    providers: [
        CollectibleService
    ],
    directives: [
        CollectiblesTable
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
    ngOnChanges(changes: Map<string, any>): void {
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
    title: string;
    table: TableOptions;
}
