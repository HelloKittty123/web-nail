import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private http: HttpClient,
  ) { }
  public getHeader() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }),

    };
  }
  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url, this.getHeader());
  }

  getWithParam<T>(url: string, params: any,): Observable<T> {
    const httpParams = new HttpParams({ fromObject: params });
    const httpOptions = {
      params: httpParams,
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }),
    };

    return this.http.get<T>(url, httpOptions)
  }

  post<T>(URL: string, body: any): Observable<T> {
    return this.http.post<T>(URL, body, this.getHeader())
  }

  put<T>(URL: string, body: any): Observable<T> {
    return this.http.put<T>(URL, body, this.getHeader())
  }

  delete<T>(URL: string): Observable<T> {
    return this.http.delete<T>(URL, this.getHeader())
  }

  patch<T>(URL: string, body: any): Observable<T> {
    return this.http.patch<T>(URL, body, this.getHeader())
  }

}
