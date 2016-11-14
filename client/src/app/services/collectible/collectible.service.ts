import { Injectable }                    from '@angular/core';
import { Observable }                    from 'rxjs/Observable';
import { User, CurrentUser }             from '../../models/user';
import { Collectible }                   from '../../models/collectible';
import { HttpService }                   from '../http/http.service';
import { AuthenticateService }           from '../authenticate/authenticate.service';

@Injectable()
export class CollectibleService {
    constructor(private httpService: HttpService, private authService: AuthenticateService) { }
    /**
     * Retrieve all collectibles, or all collectibles of a specified user.
     */
    readAll(id?: string, offset?: number, limit?: number): Observable<Collectible[]> {
        let url: string = (id == null)  ? '/api/v1/collectible' : '/api/v1/u/' + id + '/collectible';
        let query: string = this.httpService.makeQueryString({
            "offset": offset,
            "limit": limit
        });
        return this.httpService.getSimple(url, this.authService.getToken())
            .map( (json) => { 
                if (!json.status)
                    throw json.message;
                return json.data; 
            })
            .map( (jsonCollectibles) => {
                var collectibles: Collectible[] = [];
                for (var i = 0; i < jsonCollectibles.length; i++) {
                    collectibles.push(new Collectible(jsonCollectibles[i]));
                }
                return collectibles;
            });
    }
    /**
     * Retrieve single collectible.
     */
    read(id: string) {
        return this.httpService.getSimple('/api/v1/collectible/' + id, this.authService.getToken())
            .map( (json) => { 
                if (!json.status)
                    throw json.message;
                return new Collectible(json.data);
            });
    }
    /**
     * Create a new collectable.
     */
    create(user: User, collectible: Collectible): Observable<Collectible> {
        let url: string = '/api/v1/u/' + user._id + '/collectible';
        return this.httpService.postSimple(url, collectible, this.authService.getToken())
            .map( (json) => {
                if (!json.status)
                    throw json.message;
                return new Collectible(json.data);
            });
    }
    /**
     * Create a new collectable.
     */
    update(user: User, collectible: Collectible): Observable<Collectible> {
        let url: string = '/api/v1/collectible/' + collectible._id
        return this.httpService.patchSimple(url, collectible, this.authService.getToken())
            .map( (json) => {
                if (!json.status)
                    throw json.message;
                return new Collectible(json.data);
            });
    }
    /**
     * Delete a single collectible.
     */
    delete(id: string): Observable<boolean> {
        return this.httpService.deleteSimple('/api/v1/collectible/' + id, this.authService.getToken())
            .map( (json) => { 
                if (!json.status)
                    throw json.message;
                return true; 
            });
    }
}
