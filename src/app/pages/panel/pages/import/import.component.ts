import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import * as XLSX from 'xlsx';

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {

  subscription: Subscription[] = []
  form: FormGroup
  file: File
  sheetOptions = []
  data: [][]

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
        this.data = []
        if (data) this.readSheet(data)
      })
    )
  }

  handleChangeFile($event: Event) {
    this.file = $event.target['files'][0]
    this.readWorkBook()
  }

  readWorkBook() {
    this.sheetOptions = []
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      const bufferArray = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bufferArray, {type: 'buffer'});
      this.sheetOptions = wb.SheetNames.map(item => {
        return {id: item, name: item}
      })
    }
  }

  readSheet(selectedSheetName: string) {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      const bufferArray = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bufferArray, {type: 'buffer'});
      const sheet = this.sheetOptions.find(s => s.name === selectedSheetName)
      const ws: XLSX.WorkSheet = wb.Sheets[sheet.name];
      this.data = XLSX.utils.sheet_to_json(ws, {header: 1});
    }
  }
}
