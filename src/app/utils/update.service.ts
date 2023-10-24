import {Injectable} from '@angular/core';
import {filter} from "rxjs";
import {SwUpdate, VersionReadyEvent} from "@angular/service-worker";

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(
    private swUpdate: SwUpdate
  ) {
  }

  public checkForUpdates(): void {
    this.swUpdate.versionUpdates.pipe(
      filter((evt): evt is VersionReadyEvent => evt.type === "VERSION_READY")
    ).subscribe(evt => document.location.reload())
  }
}
