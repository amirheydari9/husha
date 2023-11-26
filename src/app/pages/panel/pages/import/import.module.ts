import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImportComponent} from './import.component';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from "@angular/forms";
import {CustomDropdownModule} from "../../../../ui-kits/custom-dropdown/custom-dropdown.component";
import {GeneralFormModule} from "../../../../components/general-form/general-form.component";
import {CustomImportExcelModule} from "../../../../ui-kits/custom-import-excel/custom-import-excel.component";
import {CustomGridModule} from "../../../../ui-kits/custom-grid/custom-grid.component";


@NgModule({
  declarations: [
    ImportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: ImportComponent}]),
    ReactiveFormsModule,
    CustomDropdownModule,
    GeneralFormModule,
    CustomImportExcelModule,
    CustomGridModule
  ]
})
export class ImportModule {
}
