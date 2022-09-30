import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router'
import { WebStory } from '@webstory/iris-uri'
import {
  catchError,
  concatMap,
  delay,
  EMPTY,
  iif,
  Observable,
  of,
  retryWhen,
  throwError,
} from 'rxjs'
import { WebstoryRepositoryService } from './services/webstory-repository.service'

@Injectable({ providedIn: 'root' })
export class WebStoryGetResolver implements Resolve<WebStory> {
  constructor(
    private editorRepository: WebstoryRepositoryService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state: RouterStateSnapshot
  ): Observable<WebStory> {
    const guid = decodeURIComponent(<string>route.paramMap.get('guid'))
    return this.editorRepository.getWebstoryByGuid(guid, true).pipe(
      // multiple retry, le temps que SOLR indexe la webstory...
      retryWhen((errors) =>
        errors.pipe(
          concatMap((e, i) =>
            iif(
              () => i > 8,
              // If the condition is true we throw the error (the last error)
              throwError(() => e),
              // Otherwise we pipe this back into our stream and delay the retry
              of(e).pipe(delay(750))
            )
          )
        )
      ),
      catchError(() => {
        this.router.navigate(['/notfound'], {
          skipLocationChange: true,
        })
        return EMPTY
      })
    )
  }
}
