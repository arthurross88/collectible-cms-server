import { Component }                     from '@angular/core';
import { OnInit }                        from '@angular/core';
import { Title }                         from '@angular/platform-browser';
import { Config, ConfigContainer }       from './models/config';
import { HttpService }                   from './services/http/http.service';
import { UserService }                   from './services/user/user.service';
import { AuthenticateService }           from './services/authenticate/authenticate.service';
import { ConfigService }                 from './services/config/config.service';
import '../../public/css/style.css';

@Component({
    selector: 'my-app',
    template: `
        <div class="public-app">
            <cc-site-menu-main></cc-site-menu-main>
            <div *ngIf="!working && configContainer.config.motd.length > 0" class="motd">
                {{ configContainer.config.motd }}
            </div>
            <router-outlet></router-outlet>
        </div>
    `,
    styles: [`
        .motd {
            padding: 0.4em;
            font-size: 0.90em;
            background-color: #f9f9f9;
            color: #00a000;
            border-top: 1px solid #d0d0d0;
            border-bottom: 1px solid #e0e0e0;
            text-align: center;
        }
    `],
    providers: [
        Title,
        HttpService,
        UserService,
        AuthenticateService,
        ConfigService
    ]
})
export class AppComponent implements OnInit {
    config: Config = null;
    working = false;
    configContainer: ConfigContainer;
    constructor(private titleService: Title, private configService: ConfigService) { }
    ngOnInit() {
        this.working = true;
        this.configService.read().subscribe(
            configContainer => { 
                if (configContainer) {
                    this.configContainer = configContainer;
                    this.titleService.setTitle(this.configContainer.config.siteTitle);
                }
            },
            err => { console.log(err) },
            () => { this.working = false; }
        );
    }
};
