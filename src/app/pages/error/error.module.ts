import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorRoutingModule } from './error-routing.module';
import { ErrorComponent } from './error.component';


@NgModule({
    declarations: [
        ErrorComponent
    ],
    exports: [
        ErrorComponent
    ],
    imports: [
        CommonModule,
        ErrorRoutingModule
    ]
})
export class ErrorModule { }
