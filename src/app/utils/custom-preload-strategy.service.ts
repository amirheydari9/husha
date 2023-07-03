import {Injectable} from '@angular/core';
import {Route} from "@angular/router";
import {map, Observable, of, timer} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CustomPreloadStrategyService {

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // const loadRoute = (delay) => delay > 0 ? timer(delay * 1000).pipe(map(() => load())) : load();
    // if (route.data && route.data['preload']) {
    //   const delay = route.data['loadAfterSeconds'] ? route.data['loadAfterSeconds'] : 0;
    //   return loadRoute(delay);
    // }
    // return of(null);

    const loadRoute = (delay) => delay > 0 ? timer(delay * 1000).pipe(map(() => load())) : load();
    const delay = route.data && route.data['loadAfterSeconds'] ? route.data['loadAfterSeconds'] : 5;
    return loadRoute(delay);

    // const connection = navigator.connection;
    //   if (connection.saveData) {
    //     return of(null);
    //   }
    //   const speed = connection.effectiveType;
    //   const slowConnections = ['slow-2g', '2g'];
    //   if (slowConnections.includes(speed)) {
    //     return of(null);
    //   }
    //   return load();
  }
}
