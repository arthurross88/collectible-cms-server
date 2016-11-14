// Core
import { NgModule }                      from '@angular/core';
import { BrowserModule }                 from '@angular/platform-browser';
import { FormsModule }                   from '@angular/forms';
import { HttpModule }                    from '@angular/http';
import { AppComponent }                  from './app.component';
import 'rxjs/add/operator/map';
// Routes, Landing pages.
import { routing, 
         appRoutingProviders }           from './app.routing';
import { RoutesSiteHomeComponent }       from './routes/site/home/component';
import { RoutesAdminHomeComponent }      from './routes/admin/home/component';
import { RoutesUsersProfileComponent }   from './routes/users/profile/component';
import { RoutesUsersEditComponent }      from './routes/users/edit/component';
import { RoutesCollectibleView }         from './routes/collectible/view/view.component';
import { RoutesCollectibleEdit }         from './routes/collectible/edit/edit.component';
// Components / Directives.
import { SiteAlertComponent }            from './components/site/alert/component';
import { SiteMenuMainComponent }         from './components/site/menu/main/component';
import { SiteConfigComponent }           from './components/site/config/component';
import { SiteCollectibles }              from './components/site/collectibles/collectibles.component';
import { LoginComponent }                from './components/login/component';
import { Pagination }                    from './components/site/pagination/pagination.component';
import { ImagesTable }                   from './components/files/table/table.component';
import { CollectibleFull }               from './components/collectibles/full/full.component';
import { CollectiblesTable }             from './components/collectibles/table/table.component';
import { CollectiblesThumbnail }         from './components/collectibles/thumbnail/thumbnail.component';
import { CollectibleCreate }             from './components/collectibles/create/create.component';
import { CollectibleEdit }               from './components/collectibles/edit/edit.component';
import { UsersListsAllComponent }        from './components/users/lists/all/component';
import { UsersCreateQuickComponent }     from './components/users/create/quick/component';
import { UsersThumbnail }                from './components/users/thumbnail/thumbnail.component';
import { UserImages }                    from './components/users/images/images.component';
import { UsersTile }                     from './components/users/tile/tile.component';
import { UserCollectibles }              from './components/users/collectibles/collectibles.component';
import { UsersTable }                    from './components/users/table/table.component';
import { FilesUploadComponent }          from './components/files/upload/upload.component';
import { Thumbnail as ImagesThumbnail }  from './components/files/thumbnail/thumbnail.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing
    ],
    declarations: [ 
        AppComponent,
        RoutesSiteHomeComponent,
        RoutesAdminHomeComponent,
        RoutesUsersEditComponent,
        RoutesUsersProfileComponent,
        RoutesCollectibleView,
        RoutesCollectibleEdit,
        SiteAlertComponent,
        SiteMenuMainComponent, 
        SiteConfigComponent,
        SiteCollectibles,
        LoginComponent,
        Pagination,
        FilesUploadComponent,
        ImagesThumbnail,
        ImagesTable,
        CollectibleFull,
        CollectiblesTable,
        CollectiblesThumbnail,
        CollectibleCreate,
        CollectibleEdit,
        UsersListsAllComponent,
        UsersCreateQuickComponent,
        UsersThumbnail,
        UserImages,
        UserCollectibles,
        UsersTile,
        UsersTable     
    ],
    providers: [
        appRoutingProviders
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
