import { Subject } from 'rxjs'
import { WebstoryRepositoryService } from './../services/webstory-repository.service'
import { MatButtonModule } from '@angular/material/button'
import { EditorComponentModule } from './../editor/editor.component'
import { Component, ChangeDetectionStrategy, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router, RouterModule } from '@angular/router'
import { WebStory } from '@webstory/iris-uri'
import { HttpErrorResponse } from '@angular/common/http'
import { ErrorHttp } from '../models/error'

@Component({
  selector: 'webstory-create-webstory',
  templateUrl: './create-webstory.component.html',
  styleUrls: ['./create-webstory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateWebstoryComponent {
  constructor(
    private editorUpload: WebstoryRepositoryService,
    private router: Router
  ) {}

  labelButton = $localize`:@@createWebstoryComponent.button.label:Validate`

  error$: Subject<ErrorHttp> = new Subject()

  submitDisabled = false

  createWebstory(webstory: WebStory): void {
    this.submitDisabled = true
    this.editorUpload.createWebstory(webstory).subscribe({
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
  imports: [CommonModule, EditorComponentModule, RouterModule, MatButtonModule],
  declarations: [CreateWebstoryComponent],
  exports: [CreateWebstoryComponent],
})
export class CreateWebstoryComponentModule {}
