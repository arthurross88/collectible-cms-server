import { Component, Input, Output }     from '@angular/core';
import { OnInit, EventEmitter }         from '@angular/core';
import { CurrentUser }                  from '../../../models/user';
import { SafeStyle }                    from '@angular/platform-browser';
import { Collectible }                  from '../../../models/collectible';
import { AlertMessage }                 from '../../../models/alertMessage';
import { AuthenticateService }          from '../../../services/authenticate/authenticate.service';

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
    currentUser: CurrentUser;
    unique: string = Math.floor(Math.random() * 10000).toString();
    authorized: boolean = false;
    working: boolean = false;
    loaded: boolean = false;
    resizedUrl: string = '';
    style: SafeStyle;
    constructor(private authService: AuthenticateService) { 
        this.currentUser = this.authService.getCurrentUser();
    }
    ngOnInit() { }
    ngOnChanges(changes: Map<string, any>): void {
        if (changes["collectible"] !== undefined && changes["collectible"].currentValue !== undefined) {
            let c = changes['collectible'].currentValue;
            let size: number = jQuery('.cc-collectibles-thumbnail.' + this.unique + ' > .inner').css('font-size');
            this.loaded = true;
            this.authorized = (c.userId == this.currentUser.user._id) || this.currentUser.user.isAdmin();
        }
    }
    ngAfterContentChecked() {
        // Automatically load in the most efficiently sized image.
        if (!this.resizedUrl.length) {
            let sizePx: string = jQuery('.cc-collectibles-thumbnail.' + this.unique + ' > .inner').css('width');
            if (sizePx !== undefined) {
                let size: number = +sizePx.replace(/[^-\d\.]/g, '');
                let f = this.collectible.files[0];
                if (size <= 320) {
                    this.resizedUrl = f.baseUrl + '/thumb/' + f.name;
                } else if (size <= 1024) {
                    this.resizedUrl = f.baseUrl + '/full/' + f.name;
                } else {
                    this.resizedUrl = f.baseUrl + '/' + f.name;
                }
            }
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
    style: SafeStyle;
}
