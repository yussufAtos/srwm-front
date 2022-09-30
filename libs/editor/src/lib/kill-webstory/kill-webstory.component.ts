import { MatDialog } from '@angular/material/dialog'
import { ErrorHttp } from './../models/error'
import { filter, map, Observable, Subject, switchMap, tap } from 'rxjs'
import { WebstoryRepositoryService } from './../services/webstory-repository.service'
import { EditorComponentModule } from './../editor/editor.component'
import {
  Component,
  ChangeDetectionStrategy,
  NgModule,
  OnInit,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { WebStoryApiResolverData } from '../webstory-api-resolver.data'
import { applySignal, WebStory } from '@webstory/iris-uri'
import { MatButtonModule } from '@angular/material/button'
import { HttpErrorResponse } from '@angular/common/http'
import {
  DialogConfirmationComponent,
  DialogConfirmationData,
} from '@webstory/shared'
import { isWebstoryZip } from '../editor/utils/editor-webstory-utils'
import { DefaultEditorManagerValidatorStrategy } from '../services/default-editor-manager-validator-strategy'
import { KillEditorManagerValidatorStrategy } from './kill-editor-manager-validator-strategy'

@Component({
  selector: 'webstory-kill-webstory',
  templateUrl: './kill-webstory.component.html',
  styleUrls: ['./kill-webstory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DefaultEditorManagerValidatorStrategy,
      useClass: KillEditorManagerValidatorStrategy,
    },
  ],
})
export class KillWebstoryComponent implements OnInit {
  document$: Observable<WebStory> | undefined

  error$ = new Subject<ErrorHttp>()

  labelButton = $localize`:@@KillWebstoryComponent:Kill`

  modalTitle = $localize`:@@KillWebstoryComponent.modal.title:Kill a story`

  modalLabelButton = $localize`:@@KillWebstoryComponent.modal.button.label:Kill`

  submitDisabled = false

  modalKill = $localize`:@@KillWebstoryComponent.modal.content.edNote:You are about to kill this story. This is an exceptional procedure that consists in retracting the story and notifying our clients that they should retract it too. The kill must be authorised by the relevant regional or central redchef. A kill is a terminal operation on a document; it cannot be undone. Are you sure you want to continue ?`

  modalContentEditorialNoteWithKill = $localize`:@@KillWebstoryComponent.modal.content.editorialNote+kill:You are about to kill this story. This is an exceptional procedure that consists in retracting the story and notifying our clients that they should retract it too. The kill must be authorised by the relevant regional or central redchef. A kill is a terminal operation on a document; it cannot be undone. \nThis story does not have an editorial note. Are you sure you want to continue ?`

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private editorUploadService: WebstoryRepositoryService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.document$ = (
      this.route.data as Observable<WebStoryApiResolverData>
    ).pipe(map((data: WebStoryApiResolverData) => data.document))
  }

  killWebStory(webstory: WebStory): void {
    const contentDialog = !webstory.edNote
      ? this.modalContentEditorialNoteWithKill
      : this.modalKill

    webstory.pubStatus = 'http://cv.iptc.org/newscodes/pubstatusg2/canceled'

    this.matDialog
      .open<DialogConfirmationComponent, DialogConfirmationData>(
        DialogConfirmationComponent,
        {
          data: {
            title: this.modalTitle,
            actionLabel: this.modalLabelButton,
            content: contentDialog,
          },
        }
      )
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        tap(() => (this.submitDisabled = true)),
        tap(() =>
          applySignal(webstory, 'http://cv.iptc.org/newscodes/signal/update')
        ),
        switchMap(() => this.editorUploadService.killWebstory(webstory))
      )
      .subscribe({
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
  imports: [CommonModule, EditorComponentModule, MatButtonModule, RouterModule],
  declarations: [KillWebstoryComponent],
  exports: [KillWebstoryComponent],
  providers: [],
})
export class KillWebstoryComponentModule {}
