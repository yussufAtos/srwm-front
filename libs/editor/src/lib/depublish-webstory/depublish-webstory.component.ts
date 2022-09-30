import { MatButtonModule } from '@angular/material/button'
import {
  WebStoryFullView,
  WebstoryFullViewComponentModule,
} from '../webstory-full-view/webstory-full-view.component'
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  NgModule,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { Observable, map, Subject } from 'rxjs'
import { WebStoryApiResolverData } from '../webstory-api-resolver.data'
import { jnewsToWebStoryFullView } from '../utils/webstory-full-view-utils'
import { HttpErrorResponse } from '@angular/common/http'
import { WebstoryRepositoryService } from '../services/webstory-repository.service'
import { ErrorHttp } from '../models/error'
import { InstructionsBannerModule } from '@webstory/shared'

@Component({
  selector: 'webstory-depublish-webstory',
  templateUrl: './depublish-webstory.component.html',
  styleUrls: ['./depublish-webstory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepublishWebstoryComponent implements OnInit {
  submitDisabled = false

  error$: Subject<ErrorHttp> = new Subject()

  constructor(
    private route: ActivatedRoute,
    private webstoryRepository: WebstoryRepositoryService,
    private router: Router
  ) {}

  document$: Observable<WebStoryFullView> | undefined

  ngOnInit(): void {
    this.document$ = (
      this.route.data as Observable<WebStoryApiResolverData>
    ).pipe(
      map((data: WebStoryApiResolverData) => {
        const { document } = data
        return jnewsToWebStoryFullView(document)
      })
    )
  }

  depublishWebstory(guid: string): void {
    this.submitDisabled = true
    this.webstoryRepository.depublish(guid).subscribe({
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
    WebstoryFullViewComponentModule,
    InstructionsBannerModule,
    MatButtonModule,
    RouterModule,
  ],
  declarations: [DepublishWebstoryComponent],
  exports: [DepublishWebstoryComponent],
})
export class DepublishWebstoryComponentModule {}
