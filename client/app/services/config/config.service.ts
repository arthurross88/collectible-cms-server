import { Injectable }                    from '@angular/core';
import { Config, ConfigContainer }    	 from '../../models/config';
import { User }                          from '../../models/user';
import { HttpService }	                 from '../http/http.service';
import { AuthenticateService }           from '../authenticate/authenticate.service';
import { Observable }                    from 'rxjs/Observable';

@Injectable()
export class ConfigService {
    configContainer: ConfigContainer = new ConfigContainer();
    constructor(private httpService: HttpService, private authService: AuthenticateService) { }
    /**
     * Retrieve configuration.
     */
	read(): Observable<ConfigContainer> {
		return this.httpService.getSimple('/api/v1/config')
            .map( (json) => { 
                if (!json.status)
                    throw json.message;
                this.configContainer.config = json.data
                return this.configContainer;
            });
	}
    update(config: Config): Observable<ConfigContainer> {
        return this.httpService.patchSimple('/api/v1/config', config, this.authService.getToken())
            .map( (json) => {
                if (!json.status)
                    throw json.message;
                this.configContainer.config = json.data;
                return this.configContainer;
            });
    }
}
