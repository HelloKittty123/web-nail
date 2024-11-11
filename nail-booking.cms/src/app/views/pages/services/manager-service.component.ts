import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import window from 'global';
import { SharedModule } from 'primeng/api';
import { UiModal } from '../../../models/interface/uiInterface';
import { PrimengModule } from '../../../primeng.module';
import { UiConfirmService } from '../../../services/shared/ui-confirm.service';
import { UiModalService } from '../../../services/shared/ui-modal.service';
import { UiToastService } from '../../../services/shared/ui-toast.service';
import { AppService } from '../../../services/tax/tax-account.service';
import { ManagerServiceFormComponent } from './manager-service-form/manager-service-form.component';
import { ServiceGroupFormComponent } from './service-group-form/service-group-form.component';

@Component({
  selector: 'app-manager-service',
  standalone: true,
  imports: [PrimengModule, NgClass, NgIf, SharedModule],
  templateUrl: './manager-service.component.html',
  styleUrl: './manager-service.component.scss',
})
export class ManagerServiceComponent implements OnInit {
  private jwtHelper = new JwtHelperService();

  isGroupLoading: boolean = false;

  isServiceLoading: boolean = false;

  groups: any[] = [];

  services: any[] = [];

  filterService: any = {
    categoryId: null,
    page: 1,
    pageSize: 10,
  };

  totalRecord: number = 0;

  selectedAccount!: any[] | null;

  constructor(
    private toastService: UiToastService,
    private confirmationService: UiConfirmService,
    private modalService: UiModalService,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.GetAllGroup();
    this.GetService();
  }

  init() {}

  GetAllGroup() {
    this.isGroupLoading = true;
    this.appService.getAllCategoryGroup().subscribe((res: any) => {
      this.groups = res as any[];
      this.isGroupLoading = false;
    });
  }

  OnChangeServicePage(event: any) {
    console.log(event);
    this.filterService.page = event.page + 1;
    this.filterService.pageSize = event.rows;
    this.GetService();
  }

  OnChangeCategory(event: any) {
    this.filterService.categoryId = event;
    this.GetService();
  }

  GetService() {
    this.appService
      .GetSerivicePaging(this.filterService)
      .subscribe((response: any) => {
        this.totalRecord = response.totalCount;
        this.services = response.items;
      });
  }

  OpenCategoryGroup(accountData?: any) {
    console.log(accountData);
    const modalOptions: UiModal = {
      title:
        accountData == null ? 'Create group service' : 'Update group service',
      bodyComponent: ServiceGroupFormComponent,
      bodyData: {
        group: accountData,
      },
      showFooter: false,
      size: '40vw',
    };
    const modal = this.modalService.create(modalOptions);
    modal.afterClose.subscribe((response) => {
      if (response as boolean) {
        this.GetAllGroup();
      }
    });
  }

  OpenService(service?: any) {
    const modalOptions: UiModal = {
      title: service == null ? 'Create service' : 'Update service',
      bodyComponent: ManagerServiceFormComponent,
      bodyData: {
        service: service,
      },
      showFooter: false,
      size: '50vw',
    };
    const modal = this.modalService.create(modalOptions);
    modal.afterClose.subscribe((response) => {
      if (response as boolean) {
        this.GetService();
      }
    });
  }

  openRelogin(accountData: any) {}

  //Làm mới dữ liệu bảng
  Load() {
    let userId = JSON.parse(window.localStorage?.getItem('user')).id;
  }

  isConnectedAccount(token: string) {
    return !this.jwtHelper.isTokenExpired(token);
  }
}
