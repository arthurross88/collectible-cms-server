import { Component, Input, Output }     from '@angular/core';
import { OnInit, EventEmitter }         from '@angular/core';
import { DomSanitizationService }       from '@angular/platform-browser';
import { File }                         from '../../../models/file';
import { Collectible }                  from '../../../models/collectible';
import { AlertMessage }                 from '../../../models/alertMessage';

declare var jQuery;

/**
 *  <cc-collectibles-thumbnail 
 *      [options]="cThumbOptions" 
 *      [collectible]="collectible"
 *      (onAlert)="doOnAlert($event)" 
 *      (onCollectibleDelete)="doOnCollectibleDelete($event)">
 *  </cc-collectibles-thumbnail>
 */
@Component({
    moduleId: module.id,
    selector: 'cc-collectibles-thumbnail',
    templateUrl: 'thumbnail.html',
    styleUrls: ['thumbnail.css'],
})
export class CollectiblesThumbnail implements OnInit {
    @Input() options: Options;
    @Input() collectible: Collectible;
    @Output() onAlert = new EventEmitter<AlertMessage>();
    @Output() onCollectibleDelete = new EventEmitter<Collectible>();
    unique: string = Math.floor(Math.random() * 10000).toString();
    working: boolean = false;
    loaded: boolean = false;
    constructor(private sanitizer: DomSanitizationService) { }
    ngOnInit() { }
    ngOnChanges(changes: Map<string, any>): void {
        if (changes["collectible"] !== undefined && changes["collectible"].currentValue !== undefined) {
            this.loaded = true;
        }
    }
    getStyle() {
        if (this.options.width) {
            return this.sanitizer.bypassSecurityTrustStyle(
                'max-width:' + this.options.width + ';' + 
                'max-height:' + this.options.height + ';'
            );
        }
    }
    delete() {
        this.onCollectibleDelete.emit(this.collectible);
    }
};

/**
 * Support Classes.
 */
export class Options {
    // Width constraint of image. e.g. '2em'
    width: string;
    // Height constaint of image. e.g. '2em'
    height: string;
}
