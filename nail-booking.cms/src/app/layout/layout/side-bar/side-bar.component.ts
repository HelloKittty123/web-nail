import { Component } from '@angular/core';
import { PrimengModule } from '../../../primeng.module';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [PrimengModule,CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  items: MenuItem[];

  constructor(private router: Router) {}

  ngOnInit() {
      this.items = [
          {
            label: 'Tổng quan',
            icon: 'pi pi-home',
            command: () => {
              this.router.navigate(['/dashboard']);
            }
          },
          {
            label: 'Hóa đơn',
            icon: 'pi pi-file',
            items:[
              {
                label: 'Hóa đơn mua vào',
                icon: 'pi pi-file-export',
                command: () => {
                  this.router.navigate(['/dashboard']);
                }
              },
              {
                label: 'Hóa đơn bán ra',
                icon: 'pi pi-file-import',
                command: () => {
                  this.router.navigate(['/dashboard']);
                }
              }
            ]
          },
          {
            label: 'Hỗ trợ',
            icon: 'pi pi-headphones',
            command: () => {
              this.router.navigate(['/dashboard']);
            }
          },
      ];
  }

}
