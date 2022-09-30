import { Observable } from 'rxjs'

export abstract class InfoApplication {
  abstract backInfo(): Observable<InfoBack>

  abstract frontInfo(): Observable<InfoFront>
}

export interface InfoBack {
  version: string
  name: string
}

export interface InfoFront {
  version: string
  name: string
}
