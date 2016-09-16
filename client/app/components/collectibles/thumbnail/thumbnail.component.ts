import { Component, Input, Output }     from '@angular/core';
import { OnInit, EventEmitter }         from '@angular/core';
import { CurrentUser }                  from '../../../models/user';
import { SafeStyle }                    from '@angular/platform-browser';
import { Collectible }                  from '../../../models/collectible';
import { AlertMessage }                 from '../../../models/alertMessage';
import { AuthenticateService }          from '../../../services/authenticate/authenticate.service';

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
    style: SafeStyle;
    constructor(private authService: AuthenticateService) { 
        this.currentUser = this.authService.getCurrentUser();
    }
    ngOnInit() { }
    ngOnChanges(changes: Map<string, any>): void {
        if (changes["collectible"] !== undefined && changes["collectible"].currentValue !== undefined) {
            this.loaded = true;
            this.authorized = (changes['collectible'].currentValue.userId == this.currentUser.user._id) || 
                              this.currentUser.user.isAdmin();
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
    style: SafeStyle
}
