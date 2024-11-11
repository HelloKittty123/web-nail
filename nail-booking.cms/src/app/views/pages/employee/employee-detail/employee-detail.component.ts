import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { PrimengModule } from '../../../../primeng.module';
import { AppService } from '../../../../services/tax/tax-account.service';
import { UiModalService } from '../../../../services/shared/ui-modal.service';
import { UiToastService } from '../../../../services/shared/ui-toast.service';
import { SharedModule } from '../../../../shared.module';
import { IsNull } from '../../../../services/shared/common';
import { UiConfirm } from '../../../../models/interface/uiInterface';
import { UiConfirmService } from '../../../../services/shared/ui-confirm.service';
import { EnvService } from '../../../../env.service';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [PrimengModule, SharedModule],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss'
})
export class EmployeeDetailComponent {
  @Input() employee: any = null;

  isUpdate: boolean = false;

  avatar: string = "../../../../../assets/images/default-avatar.jpg";
  groups: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService,
    private modalService: UiModalService,
    private _service: AppService,
    private toastService: UiToastService,
    private confirmationService: UiConfirmService,
    private _envService: EnvService
  ) { }

  ngOnInit(): void {
    console.log(this.employee);
    if (this.employee == null) {
      this.employee = {
        id: null,
        name: null,
        userName: null,
        password: null,
        position: null,
        avatar: null
      };
      this.isUpdate = false;
    } else {
      this.isUpdate = true;
    }

    if (this.employee.avatar !== null) {
      this.avatar = `${this.employee.avatar}`;
    }
  }

  CreateOrUpdate() {

  }

  onUpload(event: any) {
    console.log(event);
  }

  GetAllGroup() {
    this.appService.getAllCategoryGroup()
      .subscribe((res: any) => {

      }
      );
  }

  delete(): void {
    const confirmOptions: UiConfirm = {
      icon: 'pi pi-question-circle',
      message: 'Are you sure you want to delete this employee?',
      title: 'Confirm',
      type: 'info',
      iconColor: 'yellow',
      confirmButtonIcon: 'pi pi-check',
      cancelButtonIcon: 'pi pi-times',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      onConfirmAction: () => {
        this._service.DeleteUser(this.employee.id).subscribe((response) =>{
          this.toastService.showSuccess("Employee has been deleted successfully");
          this.modalService.closeModal(true);
        });
      },
    };
    this.confirmationService.showConfirm(confirmOptions);
  }

  UploadAvatar(data: any) {
    let file = data.files[0];
    let form = new FormData();
    form.append("file", file);

    this._service.UploadFile(form).subscribe((response: any) => {
      this.avatar = `${this._envService.apiUrl}${response.data}`;
      this.employee.avatar = response.data;
    })
  }

  Save() {
    if (this.isUpdate) {
      this._service.UpdateUser(this.employee).subscribe((response: any) => this.toastService.showSuccess("Employee has been updated successfully"));
      this.modalService.closeModal(true);
    } else {
      this._service.AddUser(this.employee).subscribe((response: any) => this.toastService.showSuccess("Employee has been created successfully"));
      this.modalService.closeModal(true);
    }
  }
  close() {
    this.modalService.closeModal();
  }
}
