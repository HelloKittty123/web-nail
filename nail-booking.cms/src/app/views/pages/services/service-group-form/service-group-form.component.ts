import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { PrimengModule } from '../../../../primeng.module';
import { AppService } from '../../../../services/tax/tax-account.service';
import { UiModalService } from '../../../../services/shared/ui-modal.service';
import { UiToastService } from '../../../../services/shared/ui-toast.service';
import { SharedModule } from '../../../../shared.module';
import { UiConfirm } from '../../../../models/interface/uiInterface';
import { UiConfirmService } from '../../../../services/shared/ui-confirm.service';

@Component({
  selector: 'app-service-group-form',
  standalone: true,
  imports: [PrimengModule, SharedModule],
  templateUrl: './service-group-form.component.html',
  styleUrl: './service-group-form.component.scss'
})
export class ServiceGroupFormComponent {
  @Input() group: any = {
    id: null,
    name: null,
    description: null
  };
  @Input() isCreate: any = null;


  isLoading: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService,
    private modalService: UiModalService,
    private toastService: UiToastService,
    private confirmationService: UiConfirmService,
  ) { }

  ngOnInit(): void {
    if (this.group == null) {
      this.group = {
        id: null,
        name: null,
        description: null
      };

      this.isCreate = true;
    } else {
      this.isCreate = false;
    }

  }

  createOrUpdate() {
    this.appService.createOrUpdateGroup(this.group).subscribe((response) => {
      if (this.isCreate) {
        this.toastService.showSuccess("Group created successfully");
        this.modalService.closeModal(true);
      } else {
        this.toastService.showSuccess("Group updated successfully");
        this.modalService.closeModal(true);

      }
    })
  }

  delete(): void {
    const confirmOptions: UiConfirm = {
      icon: 'pi pi-question-circle',
      message: 'Are you sure you want to delete this group?',
      title: 'Confirm',
      type: 'info',
      iconColor: 'yellow',
      confirmButtonIcon: 'pi pi-check',
      cancelButtonIcon: 'pi pi-times',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      onConfirmAction: () => {
        this.appService.deleteCategoryGroup(this.group.id).subscribe((response) => {
          this.toastService.showSuccess("Group deleted successfully");
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
