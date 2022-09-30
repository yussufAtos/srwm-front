import {
  AfpDocumentType,
  PublicationStatus,
  Rendition,
  WebStory,
} from '@webstory/iris-uri'
export interface EditorFormModel {
  guid?: string
  remoteContents: RemoteContentFormModel[]
  readonly itemClass: WebStoryType
  pubStatus: PublicationStatus
  icons: RemoteContentFormModel[]
  language: 'en' | 'fr'
  headline: string
  catchline: string
  edNote: string
  mediatopics: string[]
  keywords?: string[]
}

export type WebstoryZipUploaded = Pick<
  WebStory,
  | 'icons'
  | 'remoteContents'
  | 'headline'
  | 'metadataLanguage'
  | 'contentLanguage'
>

export type WebStoryType = Extract<
  AfpDocumentType,
  'http://cv.afp.com/itemnatures/webStory'
>

export interface RemoteContentFormModel {
  href: string
  contentType: 'application/zip' | 'text/html' | 'image/png'
  rendition?: Rendition
}
