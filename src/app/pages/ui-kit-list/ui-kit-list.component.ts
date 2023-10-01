import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-ui-kit-list',
  templateUrl: './ui-kit-list.component.html',
  styleUrls: ['./ui-kit-list.component.scss']
})
export class UiKitListComponent implements OnInit {

  form: FormGroup

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      text: this.fb.control(null),
      number: this.fb.control(null, [Validators.required]),
      datepicker: this.fb.control(null, [Validators.required]),
      file: this.fb.control(null, [Validators.required]),
    })

    this.form.controls['file'].valueChanges.subscribe(data => {
      console.log(data)
    })
  }

}
