import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { NgClass, NgIf } from '@angular/common';
import { NgModel } from '@angular/forms';
import { PrimengModule } from '../../../primeng.module';
import { UiToastService } from '../../../services/shared/ui-toast.service';
import { UiConfirmService } from '../../../services/shared/ui-confirm.service';
import { UiModalService } from '../../../services/shared/ui-modal.service';
import { AppService } from '../../../services/tax/tax-account.service';
import { UiConfirm, UiModal } from '../../../models/interface/uiInterface';
import { ServiceGroupFormComponent } from './service-group-form/service-group-form.component';
import { ManagerServiceFormComponent } from './manager-service-form/manager-service-form.component';
import { SharedModule } from '../../../shared.module';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    PrimengModule,
    NgClass,
    NgIf,
    SharedModule
  ],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent implements OnInit {

  private jwtHelper = new JwtHelperService();

  isGroupLoading: boolean = false;

  isServiceLoading: boolean = false;

  groups: any[] = [];

  services: any[] = [];

  filterService: any = {
    search: null,
    page: 1,
    pageSize: 10
  }

  totalRecord: number = 0;

  selectedAccount!: any[] | null;

  constructor(
    private toastService: UiToastService,
    private confirmationService: UiConfirmService,
    private modalService: UiModalService,
    private appService: AppService,
  ) { }

  ngOnInit() {
    this.GetService();
  }

  init() {

  }

  OnChangeServicePage(event: any) {
    console.log(event);
    this.filterService.page = event.page + 1;
    this.filterService.pageSize = event.rows;
    this.GetService();
  }

  GetService() {
    this.appService.GetCustomerPaging(this.filterService).subscribe((response: any) => {
      this.totalRecord = response.totalCount;
      this.services = response.items;
    })
  }




}
