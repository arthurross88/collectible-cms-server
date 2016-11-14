import { Component }     from '@angular/core';
import { OnInit }        from '@angular/core';
import { Input }         from '@angular/core';
import { AlertMessage }  from '../../../models/alertMessage';

@Component({
    selector: 'cc-site-alert',
    templateUrl: 'view.html',
    styleUrls: ['style.css'],
})

export class SiteAlertComponent implements OnInit {
    @Input() alerts: AlertMessage[]
    constructor() { }
    close(i: any) {
        this.alerts.splice(i, 1);
    }
    ngOnInit() {
    }
};
