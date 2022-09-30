import { MatButtonModule } from '@angular/material/button'
import {
  WebStoryFullView,
  WebstoryFullViewComponentModule,
} from './../webstory-full-view/webstory-full-view.component'
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  NgModule,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { Observable, map } from 'rxjs'
import { WebStoryApiResolverData } from '../webstory-api-resolver.data'
import { jnewsToWebStoryFullView } from '../utils/webstory-full-view-utils'

@Component({
  selector: 'webstory-webstory-container',
  templateUrl: './webstory-container.component.html',
  styleUrls: ['./webstory-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebstoryContainerComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  document$!: Observable<WebStoryFullView>

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
}

@NgModule({
  imports: [
    CommonModule,
    WebstoryFullViewComponentModule,
    MatButtonModule,
    RouterModule,
  ],
  declarations: [WebstoryContainerComponent],
  exports: [WebstoryContainerComponent],
})
export class WebstoryContainerComponentModule {}
