import { NgSelectHarness } from './../ng-select-harness'
import { screen } from '@testing-library/angular'
import { ComponentHarness } from '@angular/cdk/testing'
import { MatButtonHarness } from '@angular/material/button/testing'
import userEvent from '@testing-library/user-event'
import { MatFormFieldHarness } from '@angular/material/form-field/testing'
import { WebStory } from '@webstory/iris-uri'
import { EditorFormModel } from './editor-form.model'
export class EditorHarness extends ComponentHarness {
  static hostSelector = 'webstory-editor'

  static DEFAULT_MOCK_DOCUMENT = (): WebStory => {
    return {
      headline: 'A headline',
      catchline: 'A catchline',
      guid: 'http://d.afp.com/3FQ28Q',
      version: 1,
      metadataLanguage: 'en',
      itemClass: 'http://cv.afp.com/itemnatures/webStory',
      provider: {
        uri: 'http://cv.iptc.org/newscodes/newsprovider/AFP',
        name: 'AFP',
      },
      versionCreated: '2022-03-25T22:38:53Z',
      firstCreated: '2022-03-25T22:38:53Z',
      pubStatus: 'http://cv.iptc.org/newscodes/pubstatusg2/usable',
      edNote: 'A general editorial note (aka dialogue client)',
      icons: [
        {
          href: 'http://vspar-iris-integ-scom.afp.com:8080/components/7c55d0643b13a191292da8a5a55e257afa285ea5',
          contentType: 'image/png',
          rendition: 'http://cv.iptc.org/newscodes/rendition/preview',
        },
      ],
      remoteContents: [
        {
          href: 'http://vspar-iris-d-wsback-31.afp.com:8585/components/9e2486b4c2d10d1a9413de212f9c9cd4b5edb6be',
          contentType: 'application/zip',
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
          name: 'conflicts, war and peace',
        },
        {
          uri: 'http://cv.iptc.org/newscodes/mediatopic/04000000',
          type: 'http://cv.iptc.org/newscodes/cpnature/abstract',
          name: 'economy, business and finance',
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
    }
  }

  static DEFAULT_MOCK_DOCUMENT_FROM_FORM = (): WebStory => {
    return {
      headline: 'A headline',
      catchline: 'A catchline',
      guid: 'http://d.afp.com/3FQ28Q',
      metadataLanguage: 'en',
      itemClass: 'http://cv.afp.com/itemnatures/webStory',
      provider: {
        uri: 'http://cv.iptc.org/newscodes/newsprovider/AFP',
        name: 'AFP',
      },
      pubStatus: 'http://cv.iptc.org/newscodes/pubstatusg2/usable',
      edNote: 'A general editorial note (aka dialogue client)',
      icons: [
        {
          href: 'http://vspar-iris-integ-scom.afp.com:8080/components/7c55d0643b13a191292da8a5a55e257afa285ea5',
          contentType: 'image/png',
          rendition: 'http://cv.iptc.org/newscodes/rendition/preview',
        },
      ],
      remoteContents: [
        {
          href: 'http://vspar-iris-d-wsback-31.afp.com:8585/components/9e2486b4c2d10d1a9413de212f9c9cd4b5edb6be',
          contentType: 'application/zip',
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
        },
        {
          uri: 'http://cv.iptc.org/newscodes/mediatopic/04000000',
          type: 'http://cv.iptc.org/newscodes/cpnature/abstract',
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
    }
  }

  static DEFAULT_VALUE_DOCUMENT = (): EditorFormModel => {
    return {
      language: 'en',
      edNote: 'A general editorial note (aka dialogue client)',
      headline: 'A headline',
      catchline: 'A catchline',
      pubStatus: 'http://cv.iptc.org/newscodes/pubstatusg2/usable',
      itemClass: 'http://cv.afp.com/itemnatures/webStory',
      icons: [
        {
          href: 'http://vspar-iris-integ-scom.afp.com:8080/components/7c55d0643b13a191292da8a5a55e257afa285ea5',
          contentType: 'image/png',
          rendition: 'http://cv.iptc.org/newscodes/rendition/preview',
        },
      ],
      remoteContents: [
        {
          href: 'http://vspar-iris-d-wsback-31.afp.com:8585/components/9e2486b4c2d10d1a9413de212f9c9cd4b5edb6be',
          contentType: 'application/zip',
        },
      ],
      mediatopics: [
        'http://cv.iptc.org/newscodes/mediatopic/16000000',
        'http://cv.iptc.org/newscodes/mediatopic/04000000',
      ],
    }
  }

  async getSubmitButton(): Promise<MatButtonHarness> {
    return this.locatorFor(
      MatButtonHarness.with({ selector: '[type=submit]' })
    )()
  }

  async getCancelButton(): Promise<MatButtonHarness> {
    return this.locatorFor(MatButtonHarness.with({ text: /cancel/i }))()
  }

  async getEditorialNote() {
    return this.locatorFor(
      MatFormFieldHarness.with({ floatingLabelText: /editorial note/i })
    )()
  }

  async getCatchline() {
    return this.locatorFor(
      MatFormFieldHarness.with({ floatingLabelText: /catchline/i })
    )()
  }

  async getHeadline() {
    return this.locatorFor(
      MatFormFieldHarness.with({ floatingLabelText: /headline/i })
    )()
  }

  async getLanguage() {
    return this.locatorFor(
      MatFormFieldHarness.with({ floatingLabelText: /language/i })
    )()
  }

  async getMediatopics() {
    return this.locatorFor(
      NgSelectHarness.with({ placeholder: /mediatopics/i })
    )()
  }

  async setZip(): Promise<void> {
    const file = new File([new ArrayBuffer(1)], 'file.jpg')
    const input = screen.getByLabelText(/choose amp/i)
    userEvent.upload(input, file)
    await this.waitForTasksOutsideAngular()
  }

  async setValue(webstory: EditorFormModel): Promise<void> {
    await this._setInputValue('editorial note', webstory.edNote)
    await this._setInputValue('catchline', webstory.catchline)
  }

  async verifyValue(webstory: EditorFormModel): Promise<void> {
    await this._setInputValue('editorial note', webstory.edNote)
    await this._setInputValue('headline', webstory.headline)
    await this._setInputValue('catchline', webstory.catchline)
  }

  private async _setInputValue(selector: string, value?: string) {
    if (value === null || value === undefined) {
      return
    }

    const regex = new RegExp(selector, 'i')
    userEvent.clear(await screen.findByLabelText(regex))
    userEvent.type(await screen.findByLabelText(regex), value)
  }
}
