import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {noCacheHeader, showNotificationHeader} from "../constants/keys";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient
  ) {
  }

  request<T>(method: string, url: string, body?: any, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    const options = {
      body: body,
      params: params,
      headers: headers,
    };
    return this.http.request<T>(method, url, options);
  }

  get<T>(url: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.request<T>('GET', url, null, params, headers);
  }

  // get<T>(url: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
  //   return this.http.get<T>(url, {params, headers})
  // }

  post<T>(url: string, body: any, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.request<T>('POST', url, body, params, headers);
  }

  // post<T>(url: string, body: any, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
  //   return this.http.post<T>(url, body, {params, headers})
  // }

  put<T>(url: string, body: any, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.request<T>('PUT', url, body, params, headers);
  }

  // put<T>(url: string, body: any, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
  //   return this.http.put<T>(url, body, {params, headers})
  // }

  patch<T>(url: string, body: any, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.request<T>('PATCH', url, body, params, headers);
  }

  // patch<T>(url: string, body: any, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
  //   return this.http.patch<T>(url, body, {params, headers})
  // }

  delete<T>(url: string, body?: any, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.request<T>('DELETE', url, body, params, headers);
  }

  // delete<T>(url: string, body?: any, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
  //   return this.http.delete<T>(url, {body, params, headers})
  // }

  toFormData<T>(formValue: T): FormData {
    const formData = new FormData()
    for (const key of Object.keys(formValue)) {
      const value = formValue[key]
      formData.append(key, value)
    }
    return formData
  }

  toHttpParam<T>(queryParamValue: T): HttpParams {
    let params = new HttpParams()
    for (const key of Object.keys(queryParamValue)) {
      const value = queryParamValue[key]
      if (value !== null && value !== undefined) params = params.append(key, value);
    }
    return params
  }

  showNotificationHeader(): HttpHeaders {
    return new HttpHeaders().set(showNotificationHeader, 'true')
  }

  noCacheHeader(): HttpHeaders {
    return new HttpHeaders().set(noCacheHeader, 'true')
  }
}
