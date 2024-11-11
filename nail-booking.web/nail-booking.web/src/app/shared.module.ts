import { inject, NgModule } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        NgStyle,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,

    ],
    exports: [
        FormsModule,
        CommonModule,
        NgStyle,
        RouterModule,
        ReactiveFormsModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,

    ],
    providers: [
    ]
})
export class SharedModule { }
