import { map, Observable, of } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { VERSION } from '../../environments/version'
import { InfoApplication, InfoBack, InfoFront } from '@webstory/shared'

@Injectable()
export class InfoApiService implements InfoApplication {
  constructor(private httpClient: HttpClient) {}

  //TODO remove url when dev is ready
  backInfo(): Observable<InfoBack> {
    return this.httpClient.get<InfoBackWebstory>('/softsconfigurations').pipe(
      map((el: InfoBackWebstory) => {
        return {
          name: el.domain,
          version: el.version,
        }
      })
    )
  }

  frontInfo(): Observable<InfoFront> {
    return of({
      version: VERSION.version,
      name: 'Web Story Manager client',
    })
  }
}

export interface InfoBackWebstory {
  domain: string
  project: string
  projectType: string
  owner: string
  version: string
  communication: string[]
  applicationPorts: string[]
  jmxPort: string
  packaging: string
}
