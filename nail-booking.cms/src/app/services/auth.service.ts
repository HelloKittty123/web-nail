import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import window from 'global';
import { EnvService } from '../env.service';
import { MasterService } from './master/master.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public apiURL = this.env.apiUrl;
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: any;

  constructor(private master: MasterService, private env: EnvService) {}

  getTesst() {
    return this.master.get(`${this.apiURL}WeatherForecast`);
  }

  /// Login
  login(data: any) {
    return this.master.post(`${this.apiURL}api/auth/auth`, data);
  }

  IsLoggedIn() {
    const token = window.localStorage?.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
}
