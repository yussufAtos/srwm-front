import { map, Observable, Subject } from 'rxjs'
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
import { ErrorHttp } from '../models/error'
import { HttpErrorResponse } from '@angular/common/http'

@Component({
  selector: 'webstory-edit-webstory',
  templateUrl: './edit-webstory.component.html',
  styleUrls: ['./edit-webstory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditWebstoryComponent implements OnInit {
  document$: Observable<WebStory> | undefined

  labelButton = $localize`:@@EditWebstoryComponent:Validate`

  submitDisabled = false

  error$: Subject<ErrorHttp> = new Subject()

  errors = ''

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private editorUploadService: WebstoryRepositoryService
  ) {}

  ngOnInit(): void {
    this.document$ = (
      this.route.data as Observable<WebStoryApiResolverData>
    ).pipe(map((data: WebStoryApiResolverData) => data.document))
  }

  editWebStory(webstory: WebStory): void {
    this.submitDisabled = true
    applySignal(webstory, 'http://cv.iptc.org/newscodes/signal/update')
    this.editorUploadService.editWebstory(webstory).subscribe({
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
  declarations: [EditWebstoryComponent],
  exports: [EditWebstoryComponent],
})
export class EditWebstoryComponentModule {}
