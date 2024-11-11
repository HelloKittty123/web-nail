import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, UrlTree, GuardResult, MaybeAsync } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { UiToastService } from './shared/ui-toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  messages: any = {
    token_expired: "Phiên đăng nhập đã hết hạn",
  }

  constructor(
    private router: Router,
    private message: NzMessageService,
    private authService: AuthService,
    private toastService: UiToastService
  ) { }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.IsLoggedIn()) {
      return true;
    }

    this.toastService.showToast({ message: this.messages.token_expired, type: 'warn', icon: 'pi pi-exclamation-triangle', delay: 4000 });
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.IsLoggedIn()) {
      return true;
    }

    this.toastService.showToast({ message: this.messages.token_expired, type: 'warn', icon: 'pi pi-exclamation-triangle', delay: 4000 });
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

}
