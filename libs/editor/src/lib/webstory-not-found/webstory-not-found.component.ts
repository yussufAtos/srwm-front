import { Component, ChangeDetectionStrategy, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ErrorHttpModule } from '@webstory/shared'
@Component({
  selector: 'webstory-webstory-not-found',
  templateUrl: './webstory-not-found.component.html',
  styleUrls: ['./webstory-not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebstoryNotFoundComponent {
  title = '404 webstory not found'

  message = ''

  linkToHome = ''
}

@NgModule({
  imports: [CommonModule, ErrorHttpModule],
  declarations: [WebstoryNotFoundComponent],
  exports: [WebstoryNotFoundComponent],
})
export class WebstoryNotFoundComponentModule {}
