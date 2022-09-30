import { WebStory } from '@webstory/iris-uri'
import { WebStoryFullView } from '../webstory-full-view/webstory-full-view.component'
import { jnewsToWebStoryFullView } from './webstory-full-view-utils'

describe('WebstoryFullViewUtils', () => {
  it("doit convertir une webstory de l'api vers le format d'une fullview", () => {
    const webStoryApi: WebStory = {
      guid: 'http://d.afp.com/3FQ28Q',
      version: 1,
      metadataLanguage: 'en',
      itemClass: 'http://cv.afp.com/itemnatures/webStory',
      provider: {
        uri: 'http://cv.iptc.org/newscodes/newsprovider/AFP',
        name: 'AFP',
      },
      versionCreated: '2022-05-09T17:34:58Z',
      firstCreated: '2022-03-25T22:38:53Z',
      pubStatus: 'http://cv.iptc.org/newscodes/pubstatusg2/usable',
      edNote: 'A general editorial note (aka dialogue client)',
      signals: [
        {
          uri: 'http://cv.iptc.org/newscodes/signal/cwarn',
        },
        {
          uri: 'http://cv.iptc.org/newscodes/signal/correction',
        },
      ],
      icons: [
        {
          href: 'http://vspar-iris-integ-scom.afp.com:8080/components/7c55d0643b13a191292da8a5a55e257afa285ea5',
          contentType: 'image/png',
          rendition: 'http://cv.iptc.org/newscodes/rendition/preview',
        },
      ],

      creators: [
        {
          name: 'John Doe',
          roles: ['http://cv.afp.com/creatorroles/videoJournalist'],
        },
        {
          name: 'Jeanne Dupont',
          roles: ['http://cv.afp.com/creatorroles/fieldProducer'],
        },
      ],
      contributors: [
        {
          name: 'John Doe',
          roles: ['http://cv.afp.com/creatorroles/videoJournalist'],
        },
        {
          name: 'Jeanne Dupont',
          roles: ['http://cv.afp.com/creatorroles/fieldProducer'],
        },
      ],

      contentLanguage: 'en',
      subjects: [
        {
          uri: 'http://cv.iptc.org/newscodes/mediatopic/16000000',
          type: 'http://cv.iptc.org/newscodes/cpnature/abstract',
          name: 'conflicts, war and peace',
        },
        {
          uri: 'http://cv.iptc.org/newscodes/mediatopic/04000000',
          type: 'http://cv.iptc.org/newscodes/cpnature/abstract',
          name: 'economy, business and finance',
        },
        {
          uri: 'http://ref.afp.com/persons/32639',
          type: 'http://cv.iptc.org/newscodes/cpnature/person',
          givenName: 'Vladimir',
          familyName: 'Putin',
        },
        {
          uri: 'http://eventmanager.afp.com/events/IZT27',
          type: 'http://cv.iptc.org/newscodes/cpnature/event',
          name: '#IZT27 : Russian invasion of Ukraine',
        },
        {
          uri: 'http://eventmanager.afp.com/events/ITA94',
          name: '#ITA94 : Russia-West tensions on Ukraine',
          type: 'http://cv.iptc.org/newscodes/cpnature/event',
        },
        {
          uri: 'http://ref.afp.com/locations/204',
          type: 'http://cv.iptc.org/newscodes/cpnature/geoArea',
          name: 'Ukraine',
        },
      ],
      headline: 'A headline',
      catchline: 'A catchline',
      remoteContents: [
        {
          href: 'urlzip',
          contentType: 'application/zip',
        },
        {
          href: 'https://www.afp.com/communication/webstories/balkany/story.html',
          contentType: 'text/html',
        },
      ],
    }

    const webstory: WebStoryFullView = {
      guid: 'http://d.afp.com/3FQ28Q',
      edNote: 'A general editorial note (aka dialogue client)',
      headline: 'A headline',
      catchline: 'A catchline',
      posterUrl:
        'http://vspar-iris-integ-scom.afp.com:8080/components/7c55d0643b13a191292da8a5a55e257afa285ea5',
      itemClass: 'http://cv.afp.com/itemnatures/webStory',
      language: 'en',
      mediatopics: [
        {
          uri: 'http://cv.iptc.org/newscodes/mediatopic/16000000',
          type: 'http://cv.iptc.org/newscodes/cpnature/abstract',
          name: 'conflicts, war and peace',
        },
        {
          uri: 'http://cv.iptc.org/newscodes/mediatopic/04000000',
          type: 'http://cv.iptc.org/newscodes/cpnature/abstract',
          name: 'economy, business and finance',
        },
      ],
      pubStatus: 'USABLE',
      version: 1,
      versionCreated: '2022-05-09T17:34:58Z',
      signals: ['correction'],
    }

    expect(jnewsToWebStoryFullView(webStoryApi)).toStrictEqual(webstory)
  })
})
