import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImportComponent} from './import.component';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from "@angular/forms";
import {CustomDropdownModule} from "../../../../ui-kits/custom-dropdown/custom-dropdown.component";
import {ReadExcelDirectiveModule} from "../../../../directives/read-excel.directive";
import {CustomButtonModule} from "../../../../ui-kits/custom-button/custom-button.component";
import {AgGridModule} from "ag-grid-angular";
import {GeneralFormModule} from "../../../../components/general-form/general-form.component";


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
    CustomButtonModule,
    AgGridModule,
    GeneralFormModule
  ]
})
export class ImportModule {
}
