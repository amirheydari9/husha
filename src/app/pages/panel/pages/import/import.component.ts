import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {ReadExcelDirective} from "../../../../directives/read-excel.directive";
import {ActivatedRoute} from "@angular/router";
import {dynamicField, DynamicFormComponent} from "../../../../components/dynamic-form/dynamic-form.component";
import {ColDef, GridOptions} from "ag-grid-community";
import {INPUT_FIELD_TYPE} from "../../../../constants/enums";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {

  subscription: Subscription[] = []
  form: FormGroup
  sheetOptions = []
  model: dynamicField[] = []
  columnDefs: ColDef[] = []
  gridOptions: GridOptions = {
    defaultColDef: {
      sortable: true, filter: true, flex: 1
    },
    overlayNoRowsTemplate:'رکوری جهت نمایش یافت نشد'
  }
  rowData = []

  @ViewChild('readExcel', {read: ReadExcelDirective}) readExcel: ReadExcelDirective
  @ViewChild('dynamicForm') dynamicForm: DynamicFormComponent

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
  }


  ngOnInit(): void {

    this.form = this.fb.group({
      file: this.fb.control(null),
      sheets: this.fb.control(null)
    })

    this.subscription.push(
      this.activatedRoute.params.subscribe(() => {
        const formFields = this.activatedRoute.snapshot.data['data'].fields
        for (let i in formFields) {
          if (formFields[i].editable) {
            const field = formFields[i]
            const model: dynamicField = {
              type: INPUT_FIELD_TYPE.DROP_DOWN,
              name: field.name,
              label: field.caption,
              rules: {required: true}
            }
            this.model.push(model)
          }
        }
      })
    )

    this.subscription.push(
      this.form.controls['sheets'].valueChanges.subscribe(data => {
        this.columnDefs = []
        this.rowData = []
        this.model.map(item => {
          item.options = []
          return item
        })
        this.dynamicForm.resetForm()
        if (data) this.readSheet(data)
      })
    )

    this.subscription.push(
      this.form.controls['file'].valueChanges.subscribe(data => {
        this.form.controls['sheets'].setValue(null)
      })
    )

  }


  readSheet(selectedSheetName: string) {
    this.readExcel.readSheet(selectedSheetName).subscribe(data => {
      this.model.map(item => {
        item.options = data.header
        return item
      })
      const coldDefs: ColDef[] = []
      data.header.map(item => coldDefs.push({field: item}))
      this.columnDefs = coldDefs
      this.rowData = data.rowData
    })
  }

  handleSubmitForm($event: any) {
    console.log($event)
  }
}
