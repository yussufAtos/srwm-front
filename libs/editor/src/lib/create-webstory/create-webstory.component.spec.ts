import { ErrorHttp } from './../models/error'
import { ZipUploadComponent } from './../zip-upload/zip-upload.component'
import { WebstoryRepositoryService } from './../services/webstory-repository.service'
import { EditorHarness } from './../editor/editor.harness'
import { TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import {
  CreateWebstoryComponent,
  CreateWebstoryComponentModule,
} from './create-webstory.component'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { of, throwError } from 'rxjs'
import { HttpErrorResponse, HttpResponse } from '@angular/common/http'
import { RouterTestingModule } from '@angular/router/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { WebStory } from '@webstory/iris-uri'
import { WebstoryZipUploaded } from '../editor/editor-form.model'
import { DefaultEditorManagerValidatorStrategy } from '../services/default-editor-manager-validator-strategy'

describe(CreateWebstoryComponent.name, () => {
  const target: Partial<WebStory> = {
    guid: '',
    headline: 'A headline',
    catchline: 'A catchline',
    metadataLanguage: 'en',
    contentLanguage: 'en',
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
    subjects: [
      // {
      //   uri: 'http://cv.iptc.org/newscodes/mediatopic/16000000',
      //   type: 'http://cv.iptc.org/newscodes/cpnature/abstract',
      //   name: 'conflicts, war and peace',
      // },
      // {
      //   uri: 'http://cv.iptc.org/newscodes/mediatopic/04000000',
      //   type: 'http://cv.iptc.org/newscodes/cpnature/abstract',
      //   name: 'economy, business and finance',
      // },
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

  describe('Deep rendering', () => {
    it('quand le formulaire est invalide, le bouton validate doit être disabled', async () => {
      const { harness } = await createComponent()
      const submitButton = await harness.getSubmitButton()
      expect(await submitButton.getText()).toBe('Validate')
      expect(await submitButton.isDisabled()).toBeTruthy()
    })

    it('quand le formulaire est valide, le bouton validate doit être enabled et lancer une requête', async () => {
      const { harness, mockUpload } = await createComponent()
      mockUpload.uploadZip.mockReturnValueOnce(
        of(
          new HttpResponse({
            status: 201,
            body: {
              headline: 'A headline',
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
              metadataLanguage: 'en',
              contentLanguage: 'en',
            } as WebstoryZipUploaded,
          })
        )
      )

      mockUpload.createWebstory.mockImplementation(() => of())

      await harness.setZip()
      expect(mockUpload.uploadZip).toHaveBeenCalled()
      await harness.setValue(EditorHarness.DEFAULT_VALUE_DOCUMENT())
      const submitButton = await harness.getSubmitButton()
      expect(await submitButton.isDisabled()).toBeFalsy()

      // multiple click must do nothing
      await submitButton.click()
      await submitButton.click()
      await submitButton.click()

      expect(mockUpload.createWebstory).toHaveBeenCalledTimes(1)
      expect(mockUpload.createWebstory).toHaveBeenCalledWith(target)
    })

    async function createComponent() {
      const mockUpload = {
        uploadZip: jest.fn(),
        createWebstory: jest.fn(),
      } as jest.Mocked<
        Pick<WebstoryRepositoryService, 'uploadZip' | 'createWebstory'>
      >

      TestBed.overrideComponent(ZipUploadComponent, {
        set: {
          providers: [
            {
              provide: WebstoryRepositoryService,
              useValue: mockUpload,
            },
          ],
        },
      })

      await TestBed.configureTestingModule({
        declarations: [ZipUploadComponent],
        imports: [
          NoopAnimationsModule,
          CreateWebstoryComponentModule,
          RouterTestingModule.withRoutes([]),
        ],
        providers: [
          {
            provide: WebstoryRepositoryService,
            useValue: mockUpload,
          },
          {
            provide: DefaultEditorManagerValidatorStrategy,
            useClass: DefaultEditorManagerValidatorStrategy,
          },
        ],
      }).compileComponents()

      const fixture = TestBed.createComponent(CreateWebstoryComponent)

      fixture.detectChanges()

      return {
        component: fixture.componentInstance,
        fixture,
        harness: await TestbedHarnessEnvironment.harnessForFixture(
          fixture,
          EditorHarness
        ),
        mockUpload,
        target,
      }
    }
  })

  describe('Shallow rendering', () => {
    it('doit pouvoir afficher une erreur dans le child', async () => {
      const { mockWebstoryRepository, component, mockWebStoryForm } =
        await createShallowComponent()

      const error = new HttpErrorResponse({
        status: 500,
        error: {
          timestamp: '2022-04-19T01:09:51.130+00:00',
          status: 500,
          error: 'Internal Server Error',
          message: 'Index 0 out of bounds for length 0',
          path: '/documents/',
        },
      })

      const errorSpy = jest.spyOn(component.error$, 'next')
      mockWebstoryRepository.createWebstory.mockReturnValueOnce(
        throwError(() => error)
      )

      component.createWebstory(mockWebStoryForm)
      expect(errorSpy).toHaveBeenCalled()
      expect(errorSpy).toBeCalledWith({
        message: error.error.message,
        title: error.error.error, //wtf !!
      } as ErrorHttp)
    })

    async function createShallowComponent() {
      const mockWebstoryRepository = {
        createWebstory: jest.fn(),
      } as jest.Mocked<Pick<WebstoryRepositoryService, 'createWebstory'>>

      await TestBed.configureTestingModule({
        declarations: [CreateWebstoryComponent],
        imports: [RouterTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          {
            provide: WebstoryRepositoryService,
            useValue: mockWebstoryRepository,
          },
        ],
      }).compileComponents()

      const fixture = TestBed.createComponent(CreateWebstoryComponent)

      fixture.detectChanges()

      return {
        component: fixture.componentInstance,
        fixture,
        mockWebstoryRepository,
        mockWebStoryForm: EditorHarness.DEFAULT_MOCK_DOCUMENT_FROM_FORM(),
      }
    }
  })
})
