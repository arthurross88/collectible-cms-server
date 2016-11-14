// Core.
import { Component, OnInit }             from '@angular/core';
import { ActivatedRoute }                from '@angular/router';
import { Title }                         from '@angular/platform-browser';
// Models.
import { AlertMessage }                  from '../../../models/alertMessage';
import { Collectible }                   from '../../../models/collectible';
// Services.
import { Meta }                          from '../../../services/dom/meta/meta.provider';
import { CollectibleService }            from '../../../services/collectible/collectible.service';
// Components.
import { Options as CEditOptions }       from '../../../components/collectibles/edit/edit.component';

@Component({
    selector: 'cc-routes-collectible-edit',
    templateUrl: 'edit.html',
    styleUrls: ['edit.css'],
    providers: [
        CollectibleService,
        Title,
        Meta
    ]
})
export class RoutesCollectibleEdit implements OnInit {
    alerts: AlertMessage[] = [];
    collectibleId: string;
    collectible: Collectible;
    cEditOptions: CEditOptions = new CEditOptions();
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
    doOnAlert(alert: AlertMessage) {
        this.alerts.push(alert);
    }
};
