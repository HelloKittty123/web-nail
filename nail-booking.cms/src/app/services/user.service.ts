import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constant } from '../constant/Constant';

@Injectable({
  providedIn: 'root'
})
export class UserService {
   public apiURL = Constant.API_URL;

constructor(private http: HttpClient) { }
public getHeader() {
  return {
    headers: new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem("tokenKey")}`,
      "Cache-Control":
        "no-cache, no-store, must-revalidate, post-check=0,pre-check=0",
    }),
  };
}
SetOnline(userId: string, isOnline: boolean) {
  return this.http.get(
    `${this.apiURL}User/SetOnline/` + userId + "/" + isOnline,
    this.getHeader()
  );
}
GetPermissionByUserName(userName: any) {
  return this.http.post(
    `${this.apiURL}User/GetPermissionByUserName`,
    userName,
    this.getHeader()
  );
}
}
