import { Injectable } from '@angular/core';
import { MasterService } from '../master/master.service';
import { EnvService } from '../../env.service';
import { ToUrlParam } from '../shared/common';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public apiURL = this.env.apiUrl;
  decodedToken: any;
  currentUser: any;

  constructor(
    private master: MasterService,
    private env: EnvService,
  ) { }

  getAllCategoryGroup() {
    return this.master.get(`${this.apiURL}api/category/get-all-group`);
  }

  createOrUpdateGroup(model: any) {
    return this.master.post(`${this.apiURL}api/category/create-or-update-group`, model);
  }

  deleteCategoryGroup(id) {
    return this.master.delete(`${this.apiURL}api/category/delete-group/${id}`);
  }

  GetSerivicePaging(model: any) {
    let pram = ToUrlParam(model);
    return this.master.get(`${this.apiURL}api/category/category-paging${pram}`);
  }

  CreateOrUpdateService(model: any) {
    return this.master.post(`${this.apiURL}api/category/create-or-update-category`, model);
  }

  DeleteService(id) {
    return this.master.delete(`${this.apiURL}api/category/delete-category/${id}`);
  }

  GetEmployeePaging(model: any) {
    let pram = ToUrlParam(model);
    return this.master.get(`${this.apiURL}api/employee/get-all-paging${pram}`);
  }

  GetAllEmployee() {
    return this.master.get(`${this.apiURL}api/employee/get-all`);
  }

  GetCalendar(filter: any) {
    let param = ToUrlParam(filter);
    return this.master.get(`${this.apiURL}api/booking/get-calendar${param}`);
  }

  GetFullCalendar(filter: any) {
    let param = ToUrlParam(filter);
    return this.master.get(`${this.apiURL}api/booking/get-full-calendar${param}`);
  }

  DeleteCalendar(id: any) {
    return this.master.delete(`${this.apiURL}api/booking/delete-calendar/${id}`);
  }

  UpdateStatus(model: any) {
    return this.master.put(`${this.apiURL}api/booking/update-status`, model);
  }

  CreateStaffOnLeave(model: any) {
    return this.master.post(`${this.apiURL}api/booking/create-staff-on-leave`, model);
  }

  GetCustomerPaging(model: any) {
    let pram = ToUrlParam(model);
    return this.master.get(`${this.apiURL}api/booking/customer-paging${pram}`);
  }

  UploadFile(file: any) {
    return this.master.post(`${this.apiURL}api/employee/upload-file`, file);
  }

  AddUser(user: any) {
    return this.master.post(`${this.apiURL}api/employee/create`, user);
  }

  UpdateUser(user: any) {
    return this.master.put(`${this.apiURL}api/employee/update`, user);
  }

  DeleteUser(id: any) {
    return this.master.delete(`${this.apiURL}api/employee/delete/${id}`);
  }

  GetGallery() {
    return this.master.get(`${this.apiURL}api/category/gallery`);
  }

  UploadGalleryFile(file: any) {
    return this.master.post(`${this.apiURL}api/category/upload-file`, file);
  }

  SaveGallery(model: any) {
    return this.master.post(`${this.apiURL}api/category/gallery`, model);
  }
}
