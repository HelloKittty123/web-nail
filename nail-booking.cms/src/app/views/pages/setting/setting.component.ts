import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgClass, NgIf } from '@angular/common';
import { PrimengModule } from '../../../primeng.module';
import { UiToastService } from '../../../services/shared/ui-toast.service';
import { UiConfirmService } from '../../../services/shared/ui-confirm.service';
import { UiModalService } from '../../../services/shared/ui-modal.service';
import { AppService } from '../../../services/tax/tax-account.service';
import { SharedModule } from '../../../shared.module';
import { EnvService } from '../../../env.service';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [
    PrimengModule,
    NgClass,
    NgIf,
    SharedModule
  ],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss'
})
export class SettingComponent implements OnInit {

  gallery: any = {
    first: {
      url: null,
      title: null,
      subtile: null
    },
    second: {
      url: null,
      title: null,
      subtile: null
    },
    third: {
      url: null,
      title: null,
      subtile: null
    },
    fourth: {
      url: null,
      title: null,
      subtile: null
    },
    fifth: {
      url: null,
      title: null,
      subtile: null
    },
    sixth: {
      url: null,
      title: null,
      subtile: null
    },
    seventh: {
      url: null,
      title: null,
      subtile: null
    },
  }
  constructor(
    private toastService: UiToastService,
    private confirmationService: UiConfirmService,
    private modalService: UiModalService,
    private appService: AppService,
    private envService: EnvService
  ) { }

  ngOnInit() {
    this.GetGallrey();
  }

  GetGallrey() {
    this.appService.GetGallery().subscribe((response: any) => {
      if (response.panel != null) response.panel.url = `${this.envService.apiUrl}${response.panel.url}`

      if (response.first != null) response.first.url = `${this.envService.apiUrl}${response.first.url}`

      if (response.second != null) response.second.url = `${this.envService.apiUrl}${response.second.url}`

      if (response.third != null) response.third.url = `${this.envService.apiUrl}${response.third.url}`

      if (response.fourth != null) response.fourth.url = `${this.envService.apiUrl}${response.fourth.url}`

      if (response.fifth != null) response.fifth.url = `${this.envService.apiUrl}${response.fifth.url}`

      if (response.sixth != null) response.sixth.url = `${this.envService.apiUrl}${response.sixth.url}`

      if (response.seventh != null) response.seventh.url = `${this.envService.apiUrl}${response.seventh.url}`

      if (response.eighth != null) response.eighth.url = `${this.envService.apiUrl}${response.eighth.url}`

      this.gallery = response;
    })
  }
  UploadAvatar(data: any, item: any) {
    let file = data.files[0];
    let form = new FormData();
    form.append("file", file);

    this.appService.UploadGalleryFile(form).subscribe((response: any) => {
      item.url = `${this.envService.apiUrl}${response.data}`;
    })
  }

  Save() {
    this.appService.SaveGallery(this.gallery).subscribe((response: any) => {
      this.toastService.showSuccess("Gallery is saved");
    })
  }
}
