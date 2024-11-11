import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { UiToastService } from '../../services/shared/ui-toast.service';
import { UiAlert, UiConfirm, UiModal, UiToast } from '../../models/interface/uiInterface';
import { UiModalService } from '../../services/shared/ui-modal.service';
import { TestComponent } from '../test/test.component';
import { PrimengModule } from '../../primeng.module';
import { UiAlertService } from '../../services/shared/ui-alert.service';
import { NgzorroModule } from '../../ngzorro.module';
import { NzCalendarMode } from 'ng-zorro-antd/calendar';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { MenuItem } from 'primeng/api';
import { UiConfirmService } from '../../services/shared/ui-confirm.service';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-dashbroad',
  standalone: true,
  imports: [SharedModule, PrimengModule, NgzorroModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  current = 1;
  dashbroad!: string;
  welcomeMessage!: string;
  titleApp: string = '';
  user!: { firstName: string; lastName: string; };
  public visible = false;

  nzSlider: number;

  cities: City[] = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
  ];
  primeSelected:string;
  primeColor: string | undefined;
  primeItems: MenuItem[];
  primeSlider: number;

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private toastService: UiToastService,
    private modalService: UiModalService,
    private confirmService: UiConfirmService
  ) { }

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
  ngOnInit() {
    this.authService.getTesst().subscribe((rs: any) => {
      console.log(rs);
    });
    this.user = { firstName: 'Sammy', lastName: 'Shark' };
    this.updateTranslations();
    // this.addToastWithoutHeader();

  }
  addToast() {
    const toast: UiToast = {
      message: 'This is a dynamic toast from ExampleComponent',
      title: 'Example Toast 1234',
      type: 'success',
      placement: 'top-right',
      delay: 5000,
      showHeader: true,
      autoHide: true,
      icon: 'pi pi-check'
    };
    this.toastService.showToast(toast);
  }
  openModal() {
    const modalOptions: UiModal = {
      title: 'Modal Title',
      bodyComponent: TestComponent,
      bodyData: 'This is a dynamic modal.',
      primaryButtonText: 'Save',
      secondaryButtonText: 'Cancel',
      showFooter: true,
      size: '50vw',
      onPrimaryAction: () => {
        console.log('Primary action');
      },
      onSecondaryAction: () => {
        console.log('Secondary action');
      },
    };
    const modal = this.modalService.create(modalOptions);

    modal.afterClose.subscribe((result) => {
      console.log('Modal đã được đóng với kết quả:', result);
    });

  }

  openConfirm() {
    const confirmOptions: UiConfirm = {
      title: 'Cảnh báo',
      message: 'Bạn có muốn xóa dòng dữ liệu này ?',
      icon: 'pi pi-question-circle',
      confirmButtonText: 'Xác nhận',
      confirmButtonIcon: 'pi pi-check',
      cancelButtonText: 'Hủy',
      cancelButtonIcon: 'pi pi-times',
      onCancelAction: ()=>{
        console.log('Confirm cancel');
      },
      onConfirmAction: ()=>{
        console.log('Confirm');
      }

    };
    this.confirmService.showConfirm(confirmOptions);

  }

  private updateTranslations(): void {

    // Lấy giá trị ngôn ngữ mặc định cho các biến truyền vào
    this.translate.get(['titleApp', 'welcomeMessage', 'dashbroad']).subscribe((res: any) => {
      console.log(res);
      // res là một object chứa các giá trị chuỗi dịch tương ứng với các khóa
      this.titleApp = res.titleApp;
      this.welcomeMessage = this.translate.instant('welcomeMessage', { firstName: this.user.firstName });
      this.dashbroad = res.dashbroad;
    });

    // Đăng ký lắng nghe sự kiện thay đổi ngôn ngữ
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      // Lấy giá trị chuỗi dịch tương ứng với các khóa và cập nhật vào các biến
      this.translate.get(['titleApp', 'welcomeMessage', 'dashbroad']).subscribe((res: any) => {
        this.titleApp = res.titleApp;
        this.welcomeMessage = this.translate.instant('welcomeMessage', { firstName: this.user.firstName });
        this.dashbroad = res.dashbroad;
      });
    });
  }

  date = new Date(2012, 11, 21);
  mode: NzCalendarMode = 'month';
  date1: Date | undefined;

  panelChange(change: { date: Date; mode: string }): void {
    console.log(change.date, change.mode);
  }

  fileList: NzUploadFile[] = [
    {
      uid: '-4',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: '-xxx',
      percent: 50,
      name: 'image.png',
      status: 'uploading',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: '-5',
      name: 'image.png',
      status: 'error'
    }
  ];
  previewImage: string | undefined = '';
  previewVisible = false;

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    // if (!file.url && !file.preview) {
    //   file.preview = await getBase64(file.originFileObj!);
    // }
    // this.previewImage = file.url || file.preview;
    // this.previewVisible = true;
  };
}
