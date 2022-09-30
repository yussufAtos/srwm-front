import { Observable } from 'rxjs'
import { Component, ChangeDetectionStrategy, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { InfoApplication, InfoBack, InfoFront } from './info-application'

@Component({
  selector: 'afp-shared-version-info',
  templateUrl: './version-info.component.html',
  styleUrls: ['./version-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionInfoComponent {
  versionBack$: Observable<InfoBack>

  versionFront$: Observable<InfoFront>

  constructor(private infoApiService: InfoApplication) {
    this.versionBack$ = this.infoApiService.backInfo()
    this.versionFront$ = this.infoApiService.frontInfo()
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [VersionInfoComponent],
  exports: [VersionInfoComponent],
})
export class VersionInfoComponentModule {}
