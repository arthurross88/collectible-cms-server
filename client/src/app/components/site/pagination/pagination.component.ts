// Core.
import { Component, Input, Output,
         OnInit, EventEmitter,
         SimpleChanges }                 from '@angular/core';
// Models.
import { AlertMessage }                  from '../../../models/alertMessage';

/**
 *  <cc-pagination 
 *      [items]="files"
 *      [options]="paginationOptions"
 *      (onError)="onDoError($event)" 
 *      (onPageChange)="onDoPageChange($event)">
 *  </cc-pagination>
 */
@Component({
    selector: 'cc-pagination',
    templateUrl: 'pagination.html',
    styleUrls: ['pagination.css']
})
export class Pagination implements OnInit {
    @Input()  options: Options;
    @Input()  items: any[];
    @Output() onAlert = new EventEmitter<AlertMessage>();
    @Output() onPageChange = new EventEmitter<number>();
    working: boolean = false;
    loaded: boolean = false;
    pageCurrent: number = 1;
    buttons: number[];
    constructor() { }
    ngOnInit() { }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes["items"] !== undefined && changes["items"].currentValue !== undefined) {
            this.loaded = true;
            this.recalculate();
        }
    }
    public setPage(pageNumber: number): void {
        let maxPage: number = Math.ceil(this.items.length / this.options.itemsPerPage);
        this.pageCurrent = Math.min(maxPage, Math.max(1, pageNumber));
        this.recalculate();
        this.onPageChange.emit(this.pageCurrent);
    };
    public recalculate(): void {
        let options: any = this.options;
        let displayLeft: number = Math.max(this.pageCurrent - Math.floor(options.maxPageButtons / 2), 1);
        let displayRight: number = this.pageCurrent + Math.floor(options.maxPageButtons / 2);
        displayRight = Math.min(displayRight, Math.ceil(this.items.length / options.itemsPerPage));
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
};
