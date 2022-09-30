import { HttpClient, HttpEvent } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { WebStory } from '@webstory/iris-uri'
import { Observable, of, tap } from 'rxjs'
import { WebstoryZipUploaded } from '../editor/editor-form.model'

@Injectable({ providedIn: 'root' })
export class WebstoryRepositoryService {
  constructor(private httpClient: HttpClient) {}

  // ugly cache a supprimer !!
  // sert pour éviter un problème d'indexage côté solr, le document est pas encore maj dans XARCH...
  uglyCache: WebStoryUglyCache | undefined

  uploadZip(file: File): Observable<HttpEvent<WebstoryZipUploaded>> {
    const formData = new FormData()
    formData.append('webStoryZip', file)

    return this.httpClient.post<WebstoryZipUploaded>('/amps', formData, {
      reportProgress: true,
      observe: 'events',
    })
  }

  createWebstory(webstory: WebStory): Observable<WebStory> {
    return this.httpClient.post<WebStory>('/documents/', webstory).pipe(
      tap((webstory) => {
        this.addToCache(webstory)
      })
    )
  }

  depublish(guid: string): Observable<WebStory> {
    return this.httpClient.post<WebStory>('/documents/depublisher', undefined, {
      params: { guid: guid },
    })
  }

  editWebstory(webstory: WebStory): Observable<WebStory> {
    return this.httpClient
      .post<WebStory>('/documents/', webstory, {
        params: { guid: webstory.guid },
      })
      .pipe(
        tap((webstory) => {
          this.addToCache(webstory)
        })
      )
  }

  correctionWebstory(webstory: WebStory): Observable<WebStory> {
    return this.editWebstory(webstory)
  }

  killWebstory(webstory: WebStory): Observable<WebStory> {
    return this.editWebstory(webstory)
  }

  getWebstoryByGuid(guid: string, withCache = false): Observable<WebStory> {
    if (withCache) {
      if (
        this.uglyCache?.webstory.guid === guid &&
        new Date(this.uglyCache.lastModified + 10 * 1000).getTime() > Date.now()
      ) {
        return of(this.uglyCache.webstory)
      } else {
        // on le supprime..
        this.uglyCache = undefined
      }
    }
    return this.httpClient.get<WebStory>('/documents/', {
      params: { guid: guid },
    })
  }

  private addToCache(webstory: WebStory) {
    const el: WebStoryUglyCache = {
      lastModified: Date.now(),
      webstory: webstory,
    }

    this.uglyCache = el
  }
}

export interface WebStoryUglyCache {
  webstory: WebStory
  lastModified: number
}
