import { inject, NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf, NgStyle } from '@angular/common';
import { FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CurrencyMaskConfig, CurrencyMaskModule, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';
import { RouterModule } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import vi from '@angular/common/locales/vi';
import id from '@angular/common/locales/id';
/** config ng-zorro-antd i18n **/
import { TranslateModule } from '@ngx-translate/core';
import { NgScrollbar } from 'ngx-scrollbar';
import { FormatDatePipe, FormatPricePipe } from './shared/pipes';
import { FormatCurrencyMaskDirective } from './shared/directives';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import moment from 'moment';
import { PaginatorModule } from 'primeng/paginator';
import { ToastrModule } from 'ngx-toastr';

registerLocaleData(vi);
registerLocaleData(en);
registerLocaleData(id);
export function momentAdapterFactory() {
    return adapterFactory();
  };
export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: "right",
    allowNegative: true,
    decimal: ",",
    precision: 0,
    prefix: "",
    suffix: "",
    thousands: "."
};

@NgModule({
    declarations: [
        FormatPricePipe,
        FormatDatePipe,
        FormatCurrencyMaskDirective,
    ],
    imports: [
        CommonModule,
        NgStyle,
        NgScrollbar,
        FormsModule,
        CurrencyMaskModule,
        RouterModule,
        ReactiveFormsModule,
        PaginatorModule,
        NgIf,
        NgFor,
        CalendarModule.forRoot({ provide: DateAdapter, useFactory: momentAdapterFactory }),
        ToastrModule.forRoot()
    ],
    exports: [
        FormsModule,
        CommonModule,
        NgStyle,
        NgScrollbar,
        TranslateModule,
        CurrencyMaskModule,
        RouterModule,
        ReactiveFormsModule,
        FormatPricePipe,
        FormatDatePipe,
        NgIf,
        NgFor,
        PaginatorModule
    ],
    providers: [
        {
            provide: [CURRENCY_MASK_CONFIG], useValue: CustomCurrencyMaskConfig
        }
    ]
})
export class SharedModule { }
