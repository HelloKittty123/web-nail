import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PrimengModule } from '../../../primeng.module';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { MenuBarComponent } from '../menu-bar/menu-bar.component';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, PrimengModule, MenuBarComponent],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  userMenus: MenuItem[] | undefined;

  constructor(private router:Router){}

  ngOnInit() {
    this.userMenus = [
      {
        label: 'Cài đặt',
        items: [
          {
            label: 'Cá nhân',
            icon: 'pi pi-user',
            command: ()=>{

            }
          },
          {
            label: 'Đăng xuất',
            icon: 'pi pi-sign-out',
            command: ()=>{
              this.logout();
            }
          }
        ]
      }
    ];
  }

  logout(){
    /// clear user to local storage
    localStorage.removeItem('user');

    /// clear token to local storage
    localStorage.removeItem('token');

    /// navigate to login
    this.router.navigate(['/login']);
  }
}
