import { NgxMatDateAdapter } from '@angular-material-components/datetime-picker';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { end } from '@popperjs/core';
import { CalendarEvent, CalendarModule } from 'angular-calendar';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { API_END_POINT } from 'src/app/enviroment';
import { AppService } from 'src/app/services/app.service';
import { SharedModule } from 'src/app/shared.module';
const COLORS: any[] =
  [
    { "primary": "#F28B82", "secondary": "#F48FB1" },
    { "primary": "#D1A3D6", "secondary": "#B39DDB" },
    { "primary": "#9FA8DA", "secondary": "#B3E5FC" },
    { "primary": "#B3E5FC", "secondary": "#B2EBF2" },
    { "primary": "#B2DFDB", "secondary": "#C8E6C9" },
    { "primary": "#DCE775", "secondary": "#E6EE9C" },
    { "primary": "#FFF9C4", "secondary": "#FFECB3" },
    { "primary": "#FFE0B2", "secondary": "#FFCCBC" },
    { "primary": "#D7CCC8", "secondary": "#CFD8DC" },
    { "primary": "#F8BBD0", "secondary": "#E1BEE7" },
    { "primary": "#D1C4E9", "secondary": "#C5CAE9" },
    { "primary": "#BBDEFB", "secondary": "#B2EBF2" },
    { "primary": "#B2DFDB", "secondary": "#C8E6C9" },
    { "primary": "#E6EE9C", "secondary": "#F0F4C3" },
    { "primary": "#FFF59D", "secondary": "#FFE082" },
    { "primary": "#EF9A9A", "secondary": "#F48FB1" },
    { "primary": "#CE93D8", "secondary": "#B39DDB" },
    { "primary": "#9FA8DA", "secondary": "#90CAF9" },
    { "primary": "#81D4FA", "secondary": "#80DEEA" },
    { "primary": "#80CBC4", "secondary": "#A5D6A7" },
    { "primary": "#DCE775", "secondary": "#FFEB3B" },
    { "primary": "#FFEB3B", "secondary": "#FFE082" },
    { "primary": "#FFCC80", "secondary": "#FFAB91" },
    { "primary": "#BCAAA4", "secondary": "#B0BEC5" },
    { "primary": "#CFD8DC", "secondary": "#E1BEE7" },
    { "primary": "#C5CAE9", "secondary": "#90CAF9" },
    { "primary": "#81D4FA", "secondary": "#80DEEA" },
    { "primary": "#80CBC4", "secondary": "#C8E6C9" },
    { "primary": "#C5E1A5", "secondary": "#E6EE9C" },
    { "primary": "#FFD54F", "secondary": "#FFAB40" }
  ]
@Component({
  standalone: true,
  imports: [SharedModule, CalendarModule],
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })), // Trạng thái trước khi hiển thị (ẩn)
      transition(':enter', [               // Hiệu ứng khi xuất hiện
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [               // Hiệu ứng khi biến mất
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})

export class BookingComponent implements OnInit {

  StepConstant: any = {
    Booking: 0,
    SelectService: 1,
    SelectStaff: 2,
    SelectSchedule: 3,
    Complete: 4
  }

  step: number = 0;

  totalService: number = 0;
  totalAmount: number = 0;
  categories: any[] = [
  ]

  staffs: any[] = [];

  view: string = 'day';
  snapDraggedEvents = true;

  dayStartHour = 6;
  viewDate: Date = new Date();

  start = new Date();
  events: CalendarEvent[] = [];

  refresh: Subject<any> = new Subject();

  calendar: any = {
    categories: [],
    totalQuantity: 0,
    totalAmount: 0,
    staffId: null,
    customerName: null,
    customerPhone: null,
    customerEmail: null,
    start: new Date(),
    staffName: null
  }

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
    eighth: {
      url: null,
      title: null,
      subtile: null
    },
  }

  eventTimesChanged({ event, newStart, newEnd }: any): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next(null);
  }
  public segmentIsValid(date: Date) {
    return date.getHours() >= 8 && date.getHours() <= 17;
  }

  constructor(
    private _service: AppService,
    private _toast: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.GetCategories();
    this.GetAllStaff();
    this.GetGallery();

  }

  GetCategories() {
    this._service.GetCategories().subscribe((response) => {
      this.categories = response as any[];
      this.categories.forEach(element => {
        element.isExpand = false;
        element.totalAmount = 0;
        (element.items as any[]).forEach(item => {
          item.isSelected = false
        });
      })
    })
  }

  ExpandCategory(category: any) {
    if (category.isExpand) category.isExpand = false;
    else category.isExpand = true;
    this.categories.filter(x => x.id !== category.id).forEach(element => element.isExpand = false);

  }

  ProcessQuantity() {
    this.totalService = 0;
    this.categories.forEach(category => {
      category.totalAmount = (category.items as any[]).filter(x => x.isSelected).length;
    })
  }

  GetAllStaff() {
    this._service.GetUsers().subscribe((response) => {
      this.staffs = (response as any[]).filter(x => x.name !== 'Manager');
      this.staffs.forEach(element => {
        element.isSelected = false;
        if (element.avatar == "" || element.avatar == null) {
          element.avatar = `${API_END_POINT}files/avatar/default.jpg`
        } else {
          element.avatar = `${API_END_POINT}${element.avatar}`
        }
      })
    })
  }

  SelectService(item: any) {
    if (item.isSelected) {
      item.isSelected = false;
      this.ProcessQuantity();
    } else {
      item.isSelected = true;
      this.ProcessQuantity();
    }
  }

  SelectStaff(item: any) {
    this.staffs.forEach(element => element.isSelected = false);
    item.isSelected = true;
    this.calendar.staffId = item.id;
    this.GetCalendar(new Date());
  }

  GetGallery() {
    this._service.GetGallery().subscribe((response: any) => {
      if (response.panel != null) response.panel.url = `${API_END_POINT}${response.panel.url}`

      if (response.first != null) response.first.url = `${API_END_POINT}${response.first.url}`

      if (response.second != null) response.second.url = `${API_END_POINT}${response.second.url}`

      if (response.third != null) response.third.url = `${API_END_POINT}${response.third.url}`

      if (response.fourth != null) response.fourth.url = `${API_END_POINT}${response.fourth.url}`

      if (response.fifth != null) response.fifth.url = `${API_END_POINT}${response.fifth.url}`

      if (response.sixth != null) response.sixth.url = `${API_END_POINT}${response.sixth.url}`

      if (response.seventh != null) response.seventh.url = `${API_END_POINT}${response.seventh.url}`

      if (response.eighth != null) response.eighth.url = `${API_END_POINT}${response.eighth.url}`

      this.gallery = response;

      console.log(this.gallery);
    })
  }

  Move(stepNumber: number) {
    /// Chuyển từ màn hình chọn dịch vụ sang màn hình chọn nhân viên
    if (stepNumber == 2) {
      if (!this.categories.some(x => x.totalAmount > 0)) {
        this._toast.error("Please select at least one service");
        return;
      }
    }

    if (stepNumber == 3) {
      if (!this.staffs.some(x => x.isSelected)) {
        this._toast.error("Please select a staff member.");
        return;
      }
    }


    this.step = stepNumber;
  }


  /// Kiểm tra số điện thoại
  validateNumericInput(input: string): boolean {
    if (input == null || input == "") return false;
    // Biểu thức chính quy để kiểm tra ký tự chữ cái
    const alphabetRegex = /[a-zA-Z]/;

    // Nếu chuỗi chứa ký tự chữ cái, trả về thông báo lỗi
    if (alphabetRegex.test(input)) {
      return false;
    }

    // Nếu không có lỗi, trả về null
    return true;
  }

  validateEmail(email: string): boolean {

    if (email == null || email == "") return false;
    // Biểu thức chính quy để kiểm tra email hợp lệ
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Kiểm tra email với biểu thức chính quy
    if (!emailRegex.test(email)) {
      return false;
    }

    // Nếu email hợp lệ, trả về null
    return true;
  }



  Save() {
    if (this.calendar.customerName == null || this.calendar.customerName == "") {
      this._toast.error("Name is required", "Error");
      return;
    }


    if (!this.validateNumericInput(this.calendar.customerPhone)) {
      this._toast.error("Your phone number is invalid", "Error");
      return;
    }

    if (!this.validateEmail(this.calendar.customerEmail)) {
      this._toast.error("Your email is invalid", "Error");
      return;
    }



    this.calendar.categories = [];

    this.categories.forEach(element => {
      (element.items as any[]).forEach(cat => {
        if (cat.isSelected) this.calendar.categories.push(cat);
      })
    });

    this.calendar.staffName = this.staffs.find(x => x.id == this.calendar.staffId).name;


    let request = {
      categories: this.calendar.categories,
      customerEmail: this.calendar.customerEmail,
      customerName: this.calendar.customerName,
      customerPhone: this.calendar.customerPhone,
      staffId: this.calendar.staffId,
      staffName: this.calendar.staffName,
      start: moment(this.calendar.start).format('YYYY-MM-DDTHH:mm:00'),
      totalAmount: this.calendar.totalAmount,
      totalQuantity: this.calendar.totalQuantity,
      bookingTime: moment().format('YYYY-MM-DDTHH:mm:00')
    }
    this._service.CreateCalendar(request).subscribe((response: any) => {
      if (response.isSuccess) {
        this.Reset();
      } else {
        this._toast.error("The employee already has a work schedule during the time period you selected", "We are sorry");
      }
    })

  }

  Reset() {
    this.calendar.categories = [];
    this.calendar.staffId = null;
    this.calendar.start = new Date();
    this.calendar.customerName = null;
    this.calendar.customerPhone = null;
    this.calendar.customerEmail = null;

    this.staffs.forEach(element => element.isSelected = false);

    this.categories.forEach(element => {
      element.isExpand = false;
      element.totalAmount = 0;
      (element.items as any[]).forEach(item => {
        item.isSelected = false
      });
    })

    this.Move(4);
  }


  OnChangeViewDate(date: any) {
    let request = {
      staffId: this.calendar.staffId,
      start: moment(date).startOf('week').format('YYYY-MM-DDThh:mm:ss'),
      end: moment(date).endOf('week').format('YYYY-MM-DDThh:mm:ss')
    }

    this._service.GetCalendar(request).subscribe((response: any) => {
      let data = response as any[];
      this.events = [];
      data.filter(x => x.status == 1 || x.status == 3).forEach(element => {
        let random = Math.floor(Math.random() * (26 - 0 + 1) + 0);
        this.events.push({
          start: moment(element.start).toDate(),
          end: moment(element.end).toDate(),
          title: element.name,
          color: COLORS[random]
        })
      });
      this.refresh.next(null);

    })
  }

  GetCalendar(event?: any) {
    console.log(event);
    let request = {
      staffId: this.calendar.staffId,
      start: moment(event).startOf('week').format('YYYY-MM-DDThh:mm:ss'),
      end: moment(this.calendar.start).endOf('week').format('YYYY-MM-DDThh:mm:ss')
    }

    this._service.GetCalendar(request).subscribe((response: any) => {
      let data = response as any[];
      this.events = [];
      data.filter(x => x.status == 1 || x.status == 3).forEach(element => {
        let random = Math.floor(Math.random() * (26 - 0 + 1) + 0);
        this.events.push({
          start: moment(element.start).toDate(),
          end: moment(element.end).toDate(),
          title: element.name,
          color: COLORS[random]
        })
      });
      this.refresh.next(null);

    })
  }

}
