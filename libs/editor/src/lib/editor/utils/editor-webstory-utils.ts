import {
  WebStory,
  dispatchSubject,
  AfpSubject,
  RemoteContent,
} from '@webstory/iris-uri'
import { EditorFormModel } from '../editor-form.model'

export function jnewsToEditorForm(webstory: WebStory): EditorFormModel {
  const { mediatopics } = dispatchSubject(webstory.subjects)

  return {
    guid: webstory.guid,
    edNote: webstory.edNote || '',
    headline: webstory.headline || '',
    catchline: webstory.catchline || '',
    icons: webstory.icons,
    itemClass: 'http://cv.afp.com/itemnatures/webStory',
    language: webstory.contentLanguage,
    mediatopics: mediatopics.map((media) => media.uri),
    pubStatus: 'http://cv.iptc.org/newscodes/pubstatusg2/usable',
    remoteContents: webstory.remoteContents,
  }
}

export function editorFormToJnews(form: EditorFormModel): WebStory {
  return {
    edNote: form.edNote,
    headline: form.headline,
    catchline: form.catchline,
    guid: form.guid ?? '',
    contentLanguage: form.language,
    metadataLanguage: form.language,
    itemClass: 'http://cv.afp.com/itemnatures/webStory',
    pubStatus: 'http://cv.iptc.org/newscodes/pubstatusg2/usable',
    subjects: extractSubjectsFromEditorFormModel(form),
    provider: {
      name: 'AFP',
      uri: 'http://cv.iptc.org/newscodes/newsprovider/AFP',
    },
    icons: form.icons,
    remoteContents: form.remoteContents,
  }
}

export function isEditorialNoteEmpty(webstory: WebStory): boolean {
  return !!webstory.edNote && webstory.edNote.trim() === ''
}

export function extractSubjectsFromEditorFormModel(
  form: EditorFormModel
): AfpSubject[] {
  const subjects: AfpSubject[] = []
  for (const mediatopic of form.mediatopics) {
    subjects.push({
      type: 'http://cv.iptc.org/newscodes/cpnature/abstract',
      uri: mediatopic,
    })
  }
  return subjects
}

export function isPoster(icon: RemoteContent): boolean {
  return icon.rendition === 'http://cv.iptc.org/newscodes/rendition/preview'
}

export function isWebstoryZip(remoteContent: RemoteContent): boolean {
  return remoteContent.contentType === 'application/zip'
}
