import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {ReadExcelDirective} from "../../../../directives/read-excel.directive";

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
  excelData: [][]

  @ViewChild('readExcel', {read: ReadExcelDirective}) readExcel: ReadExcelDirective

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      file: this.fb.control(null),
      sheets: this.fb.control(null)
    })

    this.subscription.push(
      this.form.controls['sheets'].valueChanges.subscribe(data => {
        this.excelData = []
        if (data) this.readSheet(data)
      })
    )
  }


  readSheet(selectedSheetName: string) {
    this.readExcel.readSheet(selectedSheetName).subscribe(data => this.excelData = data)
  }

  handleSheets($event: string[]) {
    this.sheetOptions = $event.map(item => {
      return {id: item, name: item}
    })
  }
}
