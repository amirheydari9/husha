// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // baseUrl: 'http://86.109.33.172:8080/api/',
  baseUrl: 'http://158.255.74.80:8080/api/',
  // baseUrl:'http://192.168.0.116:8080/api/',
  basicAuthUsername: 'HushaMicroService',
  basicAuthPassword: 'Jfbg&z3dHM:m_Vcb',
  cacheTimeForHttpRequest: 60 * 60 * 8 * 1000
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
