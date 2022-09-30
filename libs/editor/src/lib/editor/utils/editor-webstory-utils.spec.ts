import { WebStory } from '@webstory/iris-uri'
import { EditorFormModel } from '../editor-form.model'
import {
  jnewsToEditorForm,
  editorFormToJnews,
  isPoster,
  isWebstoryZip,
} from './editor-webstory-utils'

describe('EditorFormModel', () => {
  it('adapt webstory to editor form', () => {
    expect(jnewsToEditorForm(DEFAULT_WEBSTORY)).toStrictEqual(DEFAULT_FORM)
  })

  it('adapt editor form to webstory', () => {
    expect(editorFormToJnews(DEFAULT_FORM)).toStrictEqual(DEFAULT_WEBSTORY)
  })
})

describe('Utils', () => {
  it('la fonction isPoster pour un remote content de type preview renvoie true', () => {
    expect(
      isPoster({
        href: 'http://vspar-iris-integ-scom.afp.com:8080/components/7c55d0643b13a191292da8a5a55e257afa285ea5',
        contentType: 'image/png',
        rendition: 'http://cv.iptc.org/newscodes/rendition/preview',
      })
    ).toBe(true)

    expect(
      isPoster({
        href: 'http://vspar-iris-integ-scom.afp.com:8080/components/7c55d0643b13a191292da8a5a55e257afa285ea5',
        contentType: 'image/png',
        rendition: 'http://cv.iptc.org/newscodes/rendition/web',
      })
    ).toBe(false)
  })

  it('la fonction isZip pour un remote content de type application/zip renvoie true', () => {
    expect(
      isWebstoryZip({
        href: 'http://vspar-iris-integ-scom.afp.com:8080/components/7c55d0643b13a191292da8a5a55e257afa285ea5',
        contentType: 'application/zip',
      })
    ).toBe(true)

    expect(
      isWebstoryZip({
        href: 'http://vspar-iris-integ-scom.afp.com:8080/components/7c55d0643b13a191292da8a5a55e257afa285ea5',
        contentType: 'image/png',
      })
    ).toBe(false)
  })
})

const DEFAULT_WEBSTORY: WebStory = {
  guid: 'http://d.afp.com/3FQ28Q',
  metadataLanguage: 'en',
  itemClass: 'http://cv.afp.com/itemnatures/webStory',
  provider: {
    uri: 'http://cv.iptc.org/newscodes/newsprovider/AFP',
    name: 'AFP',
  },
  catchline: 'A catchline',
  headline: 'A headline',
  pubStatus: 'http://cv.iptc.org/newscodes/pubstatusg2/usable',
  edNote: 'A general editorial note (aka dialogue client)',
  icons: [
    {
      href: 'http://vspar-iris-integ-scom.afp.com:8080/components/7c55d0643b13a191292da8a5a55e257afa285ea5',
      contentType: 'image/png',
      rendition: 'http://cv.iptc.org/newscodes/rendition/preview',
    },
  ],

  // creators: [
  //   {
  //     name: 'John Doe',
  //     roles: ['http://cv.afp.com/creatorroles/videoJournalist'],
  //   },
  //   {
  //     name: 'Jeanne Dupont',
  //     roles: ['http://cv.afp.com/creatorroles/fieldProducer'],
  //   },
  // ],
  contentLanguage: 'en',
  subjects: [
    {
      uri: 'http://cv.iptc.org/newscodes/mediatopic/16000000',
      type: 'http://cv.iptc.org/newscodes/cpnature/abstract',
      //  name: 'conflicts, war and peace',
    },
    {
      uri: 'http://cv.iptc.org/newscodes/mediatopic/04000000',
      type: 'http://cv.iptc.org/newscodes/cpnature/abstract',
      //  name: 'economy, business and finance',
    },
    // {
    //   uri: 'http://ref.afp.com/persons/32639',
    //   type: 'http://cv.iptc.org/newscodes/cpnature/person',
    //   givenName: 'Vladimir',
    //   familyName: 'Putin',
    // },
    // {
    //   uri: 'http://eventmanager.afp.com/events/IZT27',
    //   type: 'http://cv.iptc.org/newscodes/cpnature/event',
    //   name: '#IZT27 : Russian invasion of Ukraine',
    // },
    // {
    //   uri: 'http://eventmanager.afp.com/events/ITA94',
    //   name: '#ITA94 : Russia-West tensions on Ukraine',
    //   type: 'http://cv.iptc.org/newscodes/cpnature/event',
    // },
    // {
    //   uri: 'http://ref.afp.com/locations/204',
    //   type: 'http://cv.iptc.org/newscodes/cpnature/geoArea',
    //   name: 'Ukraine',
    // },
  ],

  // versionCreated: '2022-03-25T22:38:53Z',
  // firstCreated: '2022-03-25T22:38:53Z',
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

const DEFAULT_FORM: EditorFormModel = {
  guid: 'http://d.afp.com/3FQ28Q',
  language: 'en',
  edNote: 'A general editorial note (aka dialogue client)',
  headline: 'A headline',
  catchline: 'A catchline',
  pubStatus: 'http://cv.iptc.org/newscodes/pubstatusg2/usable',
  itemClass: 'http://cv.afp.com/itemnatures/webStory',
  remoteContents: [
    { href: 'urlzip', contentType: 'application/zip' },
    {
      href: 'https://www.afp.com/communication/webstories/balkany/story.html',
      contentType: 'text/html',
    },
  ],
  icons: [
    {
      href: 'http://vspar-iris-integ-scom.afp.com:8080/components/7c55d0643b13a191292da8a5a55e257afa285ea5',
      contentType: 'image/png',
      rendition: 'http://cv.iptc.org/newscodes/rendition/preview',
    },
  ],
  mediatopics: [
    'http://cv.iptc.org/newscodes/mediatopic/16000000',
    'http://cv.iptc.org/newscodes/mediatopic/04000000',
  ],
}
