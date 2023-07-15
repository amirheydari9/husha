import {Injectable} from '@angular/core';
import {filter} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(
    // private swUpdate: SwUpdate
  ) {
  }

  public checkForUpdates(): void {
    // this.swUpdate.versionUpdates.pipe(
    //   filter((evt): evt is VersionReadyEvent => evt["type"] === 'VERSION_READY')
    // ).subscribe(evt => document.location.reload())
  }
}
