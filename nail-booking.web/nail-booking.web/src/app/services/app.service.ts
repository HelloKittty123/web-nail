import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { MasterService } from './master.service';
import { API_END_POINT } from '../enviroment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public apiURL = API_END_POINT;
  decodedToken: any;
  currentUser: any;

  constructor(
    private master: MasterService,
  ) { }

  GetCategories() {
    return this.master.get(`${this.apiURL}api/booking/category`);
  }

  GetUsers() {
    return this.master.get(`${this.apiURL}api/booking/users`);
  }

  CreateCalendar(model: any) {
    return this.master.post(`${this.apiURL}api/booking/create`, model);
  }

  GetCalendar(model : any){
    return this.master.get(`${this.apiURL}api/booking/get-calendar?staffId=${model.staffId}&start=${model.start}&end=${model.end}`);
  }

  GetGallery(){
    return this.master.get(`${this.apiURL}api/category/gallery`);
  }
}
