import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '../../../primeng.module';
import { MegaMenuItem, MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.scss'
})
export class MenuBarComponent implements OnInit {
  menuItems: MenuItem[] | undefined;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'Work Schedule',
        icon: 'pi pi-calendar-clock',
        styleClass: 'menu-w-25rem font-semibold',
        command: () =>{
          this.router.navigate(['/dashboard']);
        }
      },
      {
        label: 'Customer',
        icon: 'pi pi-users',
        styleClass: 'menu-w-25rem font-semibold',
        command: () =>{
          this.router.navigate(['/customer']);
        }
      },
      {
        label: 'Category',
        icon: 'pi pi-th-large',
        styleClass: 'menu-w-25rem font-semibold',
        items: [
          {
            label: 'Manager Staff',
            icon: 'pi pi-circle-off',
            command: () => {
              this.router.navigate(['/manager-staff']);
            }
          },
          {
            label: 'Manager Services',
            icon: 'pi pi-circle-off',
            command: () => {
              this.router.navigate(['/manager-service']);
            }
          }
        ]
      },
      {
        label: 'Setting',
        icon: 'pi pi-cog',
        styleClass: 'menu-w-25rem font-semibold',
        command: () =>{
          this.router.navigate(['/setting']);
        }
      }
    ];
  }
}
