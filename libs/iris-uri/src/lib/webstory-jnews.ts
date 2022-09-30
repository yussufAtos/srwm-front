import { Rendition } from './rendition'
import { PublicationStatus } from './publication-status'
import { Signal } from './signal'
import { AfpSubject } from './subject'

export interface WebStory {
  guid: string
  metadataLanguage: AvailableLanguage
  contentLanguage: AvailableLanguage
  edNote?: string
  headline?: string
  catchline?: string
  pubStatus: PublicationStatus
  remoteContents: RemoteContent[]
  icons: RemoteContent[]
  itemClass: 'http://cv.afp.com/itemnatures/webStory'
  provider: {
    uri: 'http://cv.iptc.org/newscodes/newsprovider/AFP'
    name: 'AFP'
  }
  subjects?: AfpSubject[]
  signals?: Signal[]
  versionCreated?: string
  firstCreated?: string
  version?: number
  creators?: unknown[]
  contributors?: unknown[]
}

export interface RemoteContent {
  href: string
  contentType: 'application/zip' | 'text/html' | 'image/png'
  rendition?: Rendition
}

export interface Person {
  roles: string[]
  name: string
  uri: string
}

export type AvailableLanguage = 'en' | 'fr'
