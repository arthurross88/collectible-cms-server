import { platformBrowserDynamic }        from '@angular/platform-browser-dynamic';
import { AppModule }                     from './app.module';
//import { platformBrowser }               from '@angular/platform-browser';
//import { AppModuleNgFactory }            from './app.module.ngfactory';

platformBrowserDynamic().bootstrapModule(AppModule);
//platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
