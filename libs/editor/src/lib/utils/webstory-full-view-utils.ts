import {
  WebStory,
  dispatchSubject,
  humanPubStatus,
  humanSignals,
} from '@webstory/iris-uri'
import { WebStoryFullView } from '../webstory-full-view/webstory-full-view.component'

export function jnewsToWebStoryFullView(webstory: WebStory): WebStoryFullView {
  const { mediatopics } = dispatchSubject(webstory.subjects)
  return {
    guid: webstory.guid,
    edNote: webstory.edNote,
    headline: webstory.headline,
    catchline: webstory.catchline,
    posterUrl: webstory.icons.find(
      (icon) =>
        icon.rendition === 'http://cv.iptc.org/newscodes/rendition/preview'
    )?.href,
    itemClass: 'http://cv.afp.com/itemnatures/webStory',
    language: webstory.contentLanguage,
    mediatopics: mediatopics,
    pubStatus: humanPubStatus(webstory.pubStatus),
    version: webstory.version,
    versionCreated: webstory.versionCreated || '',
    signals: humanSignals(webstory.signals ?? []),
  }
}
