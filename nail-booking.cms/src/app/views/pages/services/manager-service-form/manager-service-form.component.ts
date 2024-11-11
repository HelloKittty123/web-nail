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

@Component({
  selector: 'app-manager-service-form',
  standalone: true,
  imports: [PrimengModule, SharedModule],
  templateUrl: './manager-service-form.component.html',
  styleUrl: './manager-service-form.component.scss'
})
export class ManagerServiceFormComponent {
  @Input() service: any = {
    name: null,
    categoryId: null,
    price: 0,
    duration: 0
  }

  isUpdate: boolean = false;

  groups: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService,
    private modalService: UiModalService,
    private toastService: UiToastService,
    private confirmationService: UiConfirmService,
  ) { }

  ngOnInit(): void {
    console.log(this.service);
    if (this.service == null) {
      this.service = {
        name: null,
        categoryId: null,
        price: 0,
        duration: 0
      }
    }

    if (!IsNull(this.service.id)) this.isUpdate = true;
    this.GetAllGroup();
  }

  CreateOrUpdate() {
    this.appService.CreateOrUpdateService(this.service).subscribe((response) => {
      if (!this.isUpdate) this.toastService.showSuccess("Service created successfully")
      else this.toastService.showSuccess("Service updated successfully");
      this.modalService.closeModal();
    })
  }

  GetAllGroup() {
    this.appService.getAllCategoryGroup().subscribe((res: any) => {
      this.groups = res as any[];
    });
  }

  delete(): void {
    const confirmOptions: UiConfirm = {
      icon: 'pi pi-question-circle',
      message: 'Are you sure you want to delete this service?',
      title: 'Confirm',
      type: 'info',
      iconColor: 'yellow',
      confirmButtonIcon: 'pi pi-check',
      cancelButtonIcon: 'pi pi-times',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      onConfirmAction: () => {
        this.appService.DeleteService(this.service.id).subscribe((response) => {
          this.toastService.showSuccess("Service deleted successfully");
          this.modalService.closeModal(true);
        })
      },
    };
    this.confirmationService.showConfirm(confirmOptions);
  }

  close() {
    this.modalService.closeModal();
  }
}
