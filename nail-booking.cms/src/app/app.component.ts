import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';
import { iconSubset } from './icons/icon-subset';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { UiAlertComponent } from "./components/ui-alert/ui-alert.component";
import { UiToastComponent } from './components/ui-toast/ui-toast.component';
import { UiToastService } from './services/shared/ui-toast.service';
import { UiModalComponent } from "./components/ui-modal/ui-modal.component";
import { PrimengModule } from './primeng.module';
import { ConfigurationComponent } from "./views/systems/configuration/configuration.component";
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PrimengModule, RouterOutlet, NgxSpinnerModule, UiAlertComponent, UiToastComponent, UiModalComponent,ConfirmDialogComponent, ConfigurationComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = "Save Invoice BK";
  loadingRoute: any = false;
  isConnected: any = true;
  // @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  placement: string = 'top-right';
  constructor(
    private router: Router,
    private titleService: Title,
    private translate: TranslateService,
    private toastService: UiToastService,
    private primeNgConfig: PrimeNGConfig
  ) {
    this.titleService.setTitle(this.title);
    // iconSet singleton
    // this.iconSetService.icons = { ...iconSubset };
  }
  ngAfterViewInit() {
    // if (this.toaster) {
    //   this.toastService.initialize(this.toaster);
    //   this.toastService.placement$.subscribe((placement: 'top-right') => {
    //     this.placement = placement;
    //   });
    // } else {
    //   console.error('ToasterComponent is not available.');
    // }
  }
  ngOnInit(): void {

    // Lấy giá trị ngôn ngữ mặc định cho các biến truyền vào
    this.translate.get(['titleApp']).subscribe((res: any) => {
      this.titleService.setTitle(res.titleApp); ``
    });

    // Đăng ký lắng nghe sự kiện thay đổi ngôn ngữ
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate.get(['titleApp']).subscribe((res: any) => {
        this.titleService.setTitle(res.titleApp);
      });
    });
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });

    //enable ripple effect
    this.primeNgConfig.ripple = true;
  }
}
