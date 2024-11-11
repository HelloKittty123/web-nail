import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, SharedModule } from 'primeng/api';
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
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EnvService } from '../../../env.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    PrimengModule,
    NgClass,
    NgIf,
    SharedModule
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent implements OnInit {

  isLoading: boolean = false;

  employees: any[] = [];

  filter: any = {
    categoryId: null,
    page: 1,
    pageSize: 10
  }

  totalRecord: number = 0;

  constructor(
    private toastService: UiToastService,
    private confirmationService: UiConfirmService,
    private modalService: UiModalService,
    private appService: AppService,
    private env: EnvService
  ) { }

  ngOnInit() {
    this.GetEmployee();
  }


  OnChangeServicePage(event: any) {
    console.log(event);
    this.filter.page = event.page + 1;
    this.filter.pageSize = event.rows;
    this.GetEmployee();
  }


  GetEmployee() {
    this.isLoading = true;
    this.appService.GetEmployeePaging(this.filter).subscribe((response: any) => {
      this.isLoading = false;
      this.totalRecord = response.totalCount;
      this.employees = response.items.filter(x => x.userName !== 'admin');
      this.employees.forEach(element => {
        element.avatar = `${this.env.apiUrl}${element.avatar}`;
      });
    })
  }

  Detail(staff?: any) {

    const modalOptions: UiModal = {
      title: staff == null ? 'Create staff' : 'Update staff',
      bodyComponent: EmployeeDetailComponent,
      bodyData: {
        employee: staff
      },
      showFooter: false,
      size: '50vw',
    };

    const modal = this.modalService.create(modalOptions);
    modal.afterClose.subscribe((response) => {
      this.GetEmployee();
    })
  }

}
