import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { ErrorHttp } from './../models/error'
import { EditorComponentModule } from './../editor/editor.component'
import {
  Component,
  ChangeDetectionStrategy,
  NgModule,
  OnInit,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { Observable, map, Subject, filter } from 'rxjs'
import { WebstoryRepositoryService } from '../services/webstory-repository.service'
import { WebStoryApiResolverData } from '../webstory-api-resolver.data'
import { WebStory, applySignal } from '@webstory/iris-uri'
import { MatButtonModule } from '@angular/material/button'
import { HttpErrorResponse } from '@angular/common/http'
import {
  DialogConfirmationComponent,
  DialogConfirmationData,
} from '@webstory/shared'

@Component({
  selector: 'webstory-correction-webstory',
  templateUrl: './correction-webstory.component.html',
  styleUrls: ['./correction-webstory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorrectionWebstoryComponent implements OnInit {
  document$: Observable<WebStory> | undefined

  labelButton = $localize`:@@CorrectionWebstoryComponent.button.label:Validate`

  title = $localize`:@@CorrectionWebstoryComponent.title:Correct a webstory`

  modalLabelButton = $localize`:@@CorrectionWebstoryComponent.modal.button.label:Validate`

  modalContent = $localize`:@@CorrectionWebstoryComponent.modal.content:The webstory does not have an editorial note. Are you sure you want to continue?`

  submitDisabled = false

  error$ = new Subject<ErrorHttp>()

  constructor(
    private route: ActivatedRoute,
    private editorUploadService: WebstoryRepositoryService,
    private matService: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.document$ = (
      this.route.data as Observable<WebStoryApiResolverData>
    ).pipe(map((data: WebStoryApiResolverData) => data.document))
  }

  correctionWebStory(webstory: WebStory): void {
    if (!webstory.edNote) {
      this.matService
        .open<DialogConfirmationComponent, DialogConfirmationData>(
          DialogConfirmationComponent,
          {
            data: {
              title: this.title,
              actionLabel: this.modalLabelButton,
              content: this.modalContent,
            },
          }
        )
        .afterClosed()
        .pipe(filter((result) => !!result))
        .subscribe(() => {
          this.#correctionWebstory(webstory)
        })
    } else {
      this.#correctionWebstory(webstory)
    }
  }

  #correctionWebstory(webstory: WebStory): void {
    applySignal(webstory, 'http://cv.iptc.org/newscodes/signal/correction')
    this.editorUploadService.correctionWebstory(webstory).subscribe({
      next: (res) => {
        const guid = encodeURIComponent(res.guid)
        this.router.navigate([`../${guid}/fullview`])
      },
      error: ({ error }: HttpErrorResponse) => {
        this.submitDisabled = false
        this.error$.next({ message: error.message, title: error.error })
      },
    })
  }
}

@NgModule({
  imports: [
    CommonModule,
    EditorComponentModule,
    MatButtonModule,
    MatDialogModule,
    RouterModule,
  ],
  declarations: [CorrectionWebstoryComponent],
  exports: [CorrectionWebstoryComponent],
})
export class CorrectionWebstoryComponentModule {}
