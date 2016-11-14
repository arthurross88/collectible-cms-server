import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
// Models.
import { AlertMessage } from '../../../models/alertMessage';
import { Collectible } from '../../../models/collectible';
// Services.
import { Meta } from '../../../services/dom/meta/meta.provider';
import { CollectibleService } from '../../../services/collectible/collectible.service';
// Components.
import { UserImages, Options as UserImagesOptions } from '../../../components/users/images/images.component';
import { UsersTile, Options as UserTileOptions } from '../../../components/users/tile/tile.component';
import { CollectibleFull, Options as CollectibleOptions } from '../../../components/collectibles/full/full.component';

@Component({
    selector: 'cc-routes-collectible-view',
    templateUrl: 'view.html',
    styleUrls: ['view.css'],
    providers: [
        CollectibleService,
        Title,
        Meta
    ]
})
export class RoutesCollectibleView implements OnInit {
    alerts: AlertMessage[] = [];
    collectibleId: string;
    collectible: Collectible;
    collectibleOptions: CollectibleOptions = new CollectibleOptions();
    working: boolean = false;
    loaded: boolean = false;
    constructor(private route: ActivatedRoute, private collectibleService: CollectibleService,
                private title: Title, private meta: Meta) {
        this.collectibleId = route.snapshot.params['cId'];
    }
    ngOnInit() {
        this.working = true;
        this.collectibleService.read(this.collectibleId).subscribe(
            collectible => {
                this.collectible = collectible;
                this.title.setTitle(this.collectible.name);
                this.meta.setMeta('description', this.collectible.description);
                this.loaded = true;
            },
            err => this.alerts.push({ type: 'error', message: err }),
            () => this.working = false
        );
    }
    onDoAlert(alert: AlertMessage) {
        this.alerts.push(alert);
    }
};
