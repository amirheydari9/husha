import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImportComponent} from './import.component';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from "@angular/forms";
import {CustomDropdownModule} from "../../../../ui-kits/custom-dropdown/custom-dropdown.component";
import {ReadExcelDirectiveModule} from "../../../../directives/read-excel.directive";
import {DynamicFormModule} from "../../../../components/dynamic-form/dynamic-form.component";
import {CustomButtonModule} from "../../../../ui-kits/custom-button/custom-button.component";
import {AgGridModule} from "ag-grid-angular";


@NgModule({
  declarations: [
    ImportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: ImportComponent}]),
    ReactiveFormsModule,
    CustomDropdownModule,
    ReadExcelDirectiveModule,
    DynamicFormModule,
    CustomButtonModule,
    AgGridModule
  ]
})
export class ImportModule {
}
