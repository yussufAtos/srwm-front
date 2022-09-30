import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import mediatopicsFr from './mock-mediatopics-fr.json'
import mediatopicsEn from './mock-mediatopics-en.json'
import { MediaTopic } from '../models/mediatopic'
import { AvailableLanguage } from '@webstory/iris-uri'

@Injectable({ providedIn: 'any' })
export class MetadataService {
  getMediatopics(lang: AvailableLanguage): Observable<MediaTopic[]> {
    if (lang === 'fr') {
      return of(mediatopicsFr)
    } else if (lang === 'en') {
      return of(mediatopicsEn)
    }
    return of([])
  }

  getLangs(): Lang[] {
    return [
      { label: 'French', value: 'fr' },
      { label: 'English', value: 'en' },
    ]
  }
}

export interface Lang {
  value: string
  label: string
}
