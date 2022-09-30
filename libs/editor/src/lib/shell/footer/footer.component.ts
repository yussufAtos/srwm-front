import { MatCardModule } from '@angular/material/card'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core'
import { VersionInfoComponentModule } from '@webstory/shared'

@Component({
  selector: 'webstory-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}

@NgModule({
  declarations: [FooterComponent],
  imports: [CommonModule, VersionInfoComponentModule, MatCardModule],
  exports: [FooterComponent],
})
export class FooterComponentModule {}
