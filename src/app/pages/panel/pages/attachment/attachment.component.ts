import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BaseInfoService} from "../../../../api/base-info.service";
import {Subscription} from "rxjs";
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {IFetchFormRes} from "../../../../models/interface/fetch-form-res.interface";
import {AttachmentReqDTO} from "../../../../models/DTOs/attachment-req.DTO";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss']
})
export class AttachmentComponent implements OnInit {

  subscription: Subscription [] = []
  documentForm: FormGroup

  constructor(
    private activatedRoute: ActivatedRoute,
    private baseInfoService: BaseInfoService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {

    //TODO بررسی ولیدیشن ها با خانم گلزاری
    this.documentForm = this.fb.group({
      name: this.fb.control(null, [Validators.required]),
      desc: this.fb.control(null),
      attachmentFile: this.fb.control(null, [Validators.required])
    })

    this.subscription.push(
      this.activatedRoute.params.subscribe(params => {
        const form: IFetchFormRes = this.activatedRoute.snapshot.data['data']
        this.subscription.push(
          // this.baseInfoService.getAllAttachments(this.handleAttachmentPayload(form)).subscribe(attachments => {
          //   console.log(attachments)
          // })
        )
      })
    )
  }

  handleAttachmentPayload(form: IFetchFormRes) {
    return new AttachmentReqDTO(form.id, form.formKind.id, +this.activatedRoute.snapshot.params['ownId'])
  }

}
