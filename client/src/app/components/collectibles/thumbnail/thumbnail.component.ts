// Core.
import { Component, Input, Output,
         OnInit, EventEmitter, 
         SimpleChanges }                from '@angular/core';
import { Router }                       from '@angular/router';
import { SafeStyle }                    from '@angular/platform-browser';
// Models.
import { CurrentUser }                  from '../../../models/user';
import { Collectible }                  from '../../../models/collectible';
import { AlertMessage }                 from '../../../models/alertMessage';
// Services.
import { AuthenticateService }          from '../../../services/authenticate/authenticate.service';
// Components.
import { Options as IThumbOptions}      from '../../../components/files/thumbnail/thumbnail.component';

declare var jQuery: any;

/**
 *  <cc-collectible-thumbnail 
 *      [options]="iThumbOptions" 
 *      [collectible]="collectible"
 *      (onAlert)="doOnAlert($event)" 
 *      (onCollectibleDelete)="doOnCollectibleDelete($event)">
 *  </cc-collectible-thumbnail>
 */
@Component({
    selector: 'cc-collectibles-thumbnail',
    templateUrl: 'thumbnail.html',
    styleUrls: ['thumbnail.css'],
})
export class CollectiblesThumbnail implements OnInit {
    @Input() options: IThumbOptions;
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
    constructor(private authService: AuthenticateService, 
                private router: Router) 
    { 
        this.currentUser = this.authService.getCurrentUser();
    }
    ngOnInit() { }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes["collectible"] !== undefined && changes["collectible"].currentValue !== undefined) {
            let c = changes['collectible'].currentValue;
            let size: number = jQuery('.cc-collectibles-thumbnail.' + this.unique + ' > .inner').css('font-size');
            this.authorized = (c.userId == this.currentUser.user._id) || this.currentUser.user.isAdmin();
            this.loaded = true;
        }
    }
    doOnFileDelete() {
        this.onCollectibleDelete.emit(this.collectible);
    }
    doOnFileClick() {
        this.router.navigate(['/' + this.collectible.absoluteUrl]);
    }
};
