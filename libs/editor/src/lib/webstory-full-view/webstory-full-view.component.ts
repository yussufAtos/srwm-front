import { MatIconModule } from '@angular/material/icon'
import {
  Component,
  ChangeDetectionStrategy,
  NgModule,
  Input,
  ElementRef,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  humanPubStatus,
  humanSignals,
  MediaTopicSubject,
} from '@webstory/iris-uri'
import { MatChipsModule } from '@angular/material/chips'
import { ClipboardModule } from '@angular/cdk/clipboard'
import { MatButtonModule } from '@angular/material/button'
import { WebStoryType } from '../editor/editor-form.model'

@Component({
  selector: 'webstory-full-view',
  templateUrl: './webstory-full-view.component.html',
  styleUrls: ['./webstory-full-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebstoryFullViewComponent {
  constructor(private elementRef: ElementRef) {
    this.elementRef.nativeElement.classList.add('webstory-full-view')
  }

  @Input()
  webstory: WebStoryFullView | undefined | null
}

@NgModule({
  imports: [
    CommonModule,
    MatChipsModule,
    ClipboardModule,
    MatButtonModule,
    MatIconModule,
  ],
  declarations: [WebstoryFullViewComponent],
  exports: [WebstoryFullViewComponent],
})
export class WebstoryFullViewComponentModule {}

export interface WebStoryFullView {
  guid: string
  readonly itemClass: WebStoryType
  pubStatus: ReturnType<typeof humanPubStatus>
  posterUrl?: string
  language: 'en' | 'fr'
  version: number | undefined
  headline?: string
  catchline?: string
  edNote?: string
  mediatopics: MediaTopicSubject[]
  versionCreated: string
  signals: ReturnType<typeof humanSignals>
}
