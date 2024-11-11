import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '../../../../primeng.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { UiToastService } from '../../../../services/shared/ui-toast.service';
import { SharedModule } from '../../../../shared.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [PrimengModule, SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  message: any = {
    login_success: 'Đăng nhập thành công',
    login_fail: 'Mật khẩu không đúng',
    login_notfound: 'Không tìm thấy người dùng',
  };

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: UiToastService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    // check user logined ?
    if (this.authService.IsLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  /// login
  login() {
    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        if (res.isSuccess) {
          /// save user to local storage
          localStorage.setItem('user', JSON.stringify(res.data.user));

          /// save token to local storage
          localStorage.setItem('token', res.data.token);

          /// navigate to dashboard
          this.router.navigate(['/dashboard']);

          this.toastService.showToast({
            message: this.message.login_success,
            type: 'success',
            icon: 'pi pi-check',
            delay: 4000,
          });
        } else {
          switch (res.errorCode) {
            case 1:
              this.toastService.showToast({
                message: this.message.login_notfound,
                type: 'warn',
                icon: 'pi pi-exclamation-triangle',
                delay: 4000,
              });
              break;
            default:
              this.toastService.showToast({
                message: this.message.login_fail,
                type: 'error',
                icon: 'pi pi-ban',
                delay: 4000,
              });
          }
        }
      },
    });
  }
}
