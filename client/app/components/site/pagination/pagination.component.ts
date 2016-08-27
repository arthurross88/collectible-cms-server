import { Component, Input, Output }     from '@angular/core';
import { OnInit, EventEmitter }         from '@angular/core';
import { AlertMessage }                 from '../../../models/alertMessage';

/**
 *  <cc-site-pagination 
 *      [options]="paginationOptions"
 *      (onError)="onError($event)" 
 *      (onPageChange)="onPageChange($event)">
 *  </cc-site-pagination>
 */
@Component({
    moduleId: module.id,
    selector: 'cc-site-pagination',
    templateUrl: 'pagination.html',
    styleUrls: ['pagination.css']
})
export class SitePaginationComponent implements OnInit {
    @Output() onAlert = new EventEmitter<AlertMessage>();
    @Output() onPageChange = new EventEmitter<number>();
    @Input()  options: Options;
    working: boolean = false;
    loaded: boolean = false;
    pageCurrent: number = 1;
    buttons: number[];
    constructor() { }
    ngOnInit() { }
    ngOnChanges(changes: Map<string, any>): void {
        try {
            if ((<Options> changes['options']['currentValue']).items !== undefined) {
                this.loaded = true;
                this.recalculate();
            }
        } catch(e) { }
    }
    public setPage(pageNumber: number): void {
        let maxPage: number = Math.ceil(this.options.items.length / this.options.itemsPerPage);
        this.pageCurrent = Math.min(maxPage, Math.max(1, pageNumber));
        this.recalculate();
        this.onPageChange.emit(this.pageCurrent);
    };
    public recalculate(): void {
        let options: any = this.options;
        let displayLeft: number = Math.max(this.pageCurrent - Math.floor(options.maxPageButtons / 2), 1);
        let displayRight: number = this.pageCurrent + Math.floor(options.maxPageButtons / 2);
        displayRight = Math.min(displayRight, Math.ceil(options.items.length / options.itemsPerPage));
        this.buttons = [];
        for (let x: number = displayLeft; x <= displayRight; x++) {
            this.buttons.push(x);
        }
    }
};

/**
 * Support classes.
 */
export class Options {
    pageCurrent: number = 1;
    maxPageButtons: number = 5;
    itemsPerPage: number = 10;
    items: any[];
};
