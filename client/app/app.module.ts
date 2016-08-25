import { NgModule }				         from '@angular/core';
import { BrowserModule }		         from '@angular/platform-browser';
import { FormsModule }			         from '@angular/forms';
import { Routes, RouterModule }          from '@angular/router';
import { AppComponent }			         from './app.component';
// Routes, Landing pages.
import { PasswordReset } 		         from './components/password-reset/password-reset.component';
import { RoutesSiteHomeComponent }       from './routes/site/home/component';
import { RoutesAdminHomeComponent }      from './routes/admin/home/component';
import { RoutesUsersProfileComponent }   from './routes/users/profile/component';
import { RoutesUsersEditComponent }      from './routes/users/edit/component';
// Components.
import { SiteAlertComponent }            from './components/site/alert/component';
import { SiteMenuMainComponent }         from './components/site/menu/main/component';
import { LoginComponent }                from './components/login/component';
import { UsersListsAllComponent }        from './components/users/lists/all/component';
import { UsersCreateQuickComponent }     from './components/users/create/quick/component';
import { SiteConfigComponent }           from './components/site/config/component';

const appRoutes: Routes = [
    { path: '', component: RoutesSiteHomeComponent },
    { path: 'admin', component :RoutesAdminHomeComponent },
    { path: 'password-reset', component: PasswordReset },
    { path: 'u/:id', component: RoutesUsersProfileComponent },
    { path: 'u/:id/edit', component: RoutesUsersEditComponent }
];

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		RouterModule.forRoot(appRoutes)
	],
	declarations: [ 
        AppComponent, 
        SiteAlertComponent,
        SiteMenuMainComponent, 
        LoginComponent,
        UsersListsAllComponent,
        UsersCreateQuickComponent,
        SiteConfigComponent
    ],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
