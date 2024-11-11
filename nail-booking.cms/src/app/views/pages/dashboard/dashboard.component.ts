import { Component, OnInit, ViewChild } from '@angular/core';
import { PrimengModule } from '../../../primeng.module';
import { CalendarEvent, CalendarModule } from 'angular-calendar';
import { Subject } from 'rxjs';
import moment from 'moment';
import { SharedModule } from '../../../shared.module';
import { AppService } from '../../../services/tax/tax-account.service';
import { TextGlobalConstants } from '../../../shared/TextGlobalContants';
import { COLORS } from './color';
import { da, el } from 'date-fns/locale';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ConfirmPopup, ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
const users: any[] = [
  {
    id: 0,
    name: 'John smith',
    // color: colors.yellow,
  },
  {
    id: 1,
    name: 'Jane Doe',
    // color: colors.blue,
  },
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PrimengModule, CalendarModule, SharedModule, ConfirmPopupModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  @ViewChild(ConfirmPopup) confirmPopup!: ConfirmPopup;

  accept() {
    this.confirmPopup.accept();
  }

  reject() {
    this.confirmPopup.reject();
  }

  staffs: any[] = [];

  selectType: any = [{
    name: 'Day',
    value: 'day'
  },
  {
    name: 'Week',
    value: 'week'
  }]

  view: string = 'week';
  tempView: string = 'week';

  tempViewDate: Date = new Date();
  viewDate: Date = new Date();

  users = users;

  start = new Date();
  events: CalendarEvent[] = [];

  refresh: Subject<any> = new Subject();

  filter: any = {
    staffId: null,
    start: new Date(),
    to: new Date()
  }

  showDetail: boolean = false;

  calendars: any[] = [];

  selectedCalendar: any = {
    name: null,
    start: null,
    end: null,
    customerName: null,
    customerPhone: null,
    customerEmail: null,
    staffName: null,
    serviceNames: [],
    status: 0
  }

  ShowStaffOnLeave: boolean = false;

  staffOnLeave: any = {
    staffId: null,
    fromDate: new Date(),
    toDate: new Date()
  }

  /**
   *
   */
  constructor(private appService: AppService,
    private confirmationService: ConfirmationService,
    private message: ToastrService) {


  }
  ngOnInit() {
    this.GetAllEmployee();
    this.GetData();
  }

  GetData() {
    this.filter.start = moment(this.viewDate).startOf('month').format(TextGlobalConstants.FORMAT_DATE_REQUEST);
    this.filter.end = moment(this.viewDate).endOf('month').format(TextGlobalConstants.FORMAT_DATE_REQUEST);
    this.view = this.tempView;
    this.viewDate = this.tempViewDate;
    this.GetAllCalendar();
  }

  approved: any = { primary: "#A5D6A7", secondary: "#C8E6C9" };

  pending: any = { primary: "#B0BEC5", secondary: "#CFD8DC" };

  rejected: any = { primary: "#E57373", secondary: "#EF5350" };

  GetAllCalendar() {
    let data: any[] = [];
    this.appService.GetFullCalendar(this.filter).subscribe((response: any[]) => {
      this.calendars = response;
      response.forEach(element => {
        let item: any = {
          start: moment(element.start).toDate(),
          end: moment(element.end).toDate(),
          title: element.name,
          id: element.id
        };

        if (element.status == 0) {
          item.color = this.pending;
        }
        if (element.status == 1) {
          item.color = this.approved;
        }
        if (element.status == 2) {
          item.color = this.rejected;
        }
        data.push(item)
      });
      this.events = data;
    })
  }

  randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  GetAllEmployee() {
    this.appService.GetAllEmployee().subscribe((response: any[]) => {
      this.staffs = response.filter(x => x.userName !== 'admin');

      this.staffOnLeave.id = this.staffs[0].id;
    })
  }

  ShowDetail(calendar: any) {
    this.selectedCalendar = this.calendars.find(x => x.id == calendar.event.id);
    if (this.selectedCalendar.status == 3) return;
    this.selectedCalendar.start = moment(this.selectedCalendar.start).format(TextGlobalConstants.FORMAT_DATE_TIME);
    this.selectedCalendar.end = moment(this.selectedCalendar.end).format(TextGlobalConstants.FORMAT_DATE_TIME);
    this.showDetail = true;
  }

  UpdateStatus(status) {
    if (this.selectedCalendar.start == null) return;
    let model = {
      id: this.selectedCalendar.id,
      status: status
    }
    this.appService.UpdateStatus(model).subscribe((response) => {
      this.message.success("Status has been successfully updated.", "Notice");
      this.GetData();
      this.showDetail = false;
    });
  }

  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this booking?',
      acceptLabel: 'Delete booking',
      accept: () => {
        this.appService.DeleteCalendar(this.selectedCalendar.id).subscribe((response) => {
          this.GetData();
          this.message.success("Booking is deleted", "Notice");
          this.showDetail = false;
        })
      },
      reject: () => {
        this.showDetail = false;
      }
    });
  }

  AddOnLeave() {
    this.ShowStaffOnLeave = true;
  }

  CreateStaffOnLeave() {
    if (this.staffOnLeave.staffId == null || this.staffOnLeave.staffId == undefined) {
      this.message.error('Please select a staff member', 'Notice');

      return;
    }
    this.staffOnLeave.fromDate = moment(this.staffOnLeave.fromDate).format(TextGlobalConstants.FORMAT_DATE_REQUEST);
    this.staffOnLeave.toDate = moment(this.staffOnLeave.toDate).format(TextGlobalConstants.FORMAT_DATE_REQUEST);
    this.appService.CreateStaffOnLeave(this.staffOnLeave).subscribe((response) => {
      this.message.success('Leave schedule has been created for the employee', 'Notice');
      this.ShowStaffOnLeave = false;
      this.GetData();
      this.staffOnLeave.staffId = this.staffs[0].id;
      this.staffOnLeave.date = new Date();
    })
  }
}
