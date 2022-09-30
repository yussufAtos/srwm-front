import { EditorComponent, EditorComponentModule } from './editor.component'
import { MatInputHarness } from '@angular/material/input/testing'
import { ZipUploadComponent } from './../zip-upload/zip-upload.component'
import { WebstoryRepositoryService } from './../services/webstory-repository.service'
import { EditorHarness } from './../editor/editor.harness'
import { TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { Observable, of, Subject } from 'rxjs'
import { RouterTestingModule } from '@angular/router/testing'
import { routes } from '../shell/editor.routing'
import { Component, ViewChild } from '@angular/core'
import { WebStory } from '@webstory/iris-uri'
import { EditorFormModel, WebstoryZipUploaded } from './editor-form.model'

describe(EditorComponent.name, () => {
  it("quand le formulaire est invalide, le bouton d'édition doit être disabled", async () => {
    const { harness } = await createComponent()
    const button = await harness.getSubmitButton()
    expect(await button.getText()).toBe('Send')
    expect(await button.isDisabled()).toBeTruthy()
  })

  describe('le formulaire doit contenir une série de champ', () => {
    it('doit afficher un champ  text pour les notes éditorials, catchline', async () => {
      const { harness, documentNext$, mockGetWebstory, defaultValue, fixture } =
        await createComponent()

      documentNext$.next(mockGetWebstory)
      fixture.detectChanges()
      const button = await harness.getSubmitButton()
      expect(await button.getText()).toBe('Send')
      expect(await button.isDisabled()).toBeFalsy()

      const headlineInput = await harness.getHeadline()
      expect(
        await ((await headlineInput.getControl()) as MatInputHarness).getValue()
      ).toBe(defaultValue.headline)

      const editorialNoteInput = await harness.getEditorialNote()

      expect(
        await (
          (await editorialNoteInput.getControl()) as MatInputHarness
        ).getValue()
      ).toBe(defaultValue.edNote)

      const catchlineInput = await harness.getCatchline()

      expect(
        await (
          (await catchlineInput.getControl()) as MatInputHarness
        ).getValue()
      ).toBe(defaultValue.catchline)

      const languageInput = await harness.getLanguage()
      expect(
        await ((await languageInput.getControl()) as MatInputHarness).getValue()
      ).toBe(defaultValue.language)

      const mediatopics = await harness.getMediatopics()
      expect(mediatopics).toBeDefined()
      expect(await mediatopics.getValueLabel()).toStrictEqual([
        'conflicts, war and peace',
        'economy, business and finance',
      ])
    })

    it('doit réaliser un upload du zip', async () => {
      const { harness, form, fixture, uploadOver } = await createComponent()

      const headlineInput = await harness.getHeadline()
      const languageInput = await harness.getLanguage()

      expect(
        await ((await headlineInput.getControl()) as MatInputHarness).getValue()
      ).toBe('')
      expect(
        await ((await languageInput.getControl()) as MatInputHarness).getValue()
      ).toBe('')

      const el = {
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
      } as WebstoryZipUploaded

      uploadOver(el)
      fixture.detectChanges()

      const value: EditorFormModel = form.value

      expect(value.icons).toStrictEqual([
        {
          href: 'http://vspar-iris-integ-scom.afp.com:8080/components/7c55d0643b13a191292da8a5a55e257afa285ea5',
          contentType: 'image/png',
          rendition: 'http://cv.iptc.org/newscodes/rendition/preview',
        },
      ])

      expect(value.remoteContents).toStrictEqual([
        {
          href: 'http://vspar-iris-d-wsback-31.afp.com:8585/components/9e2486b4c2d10d1a9413de212f9c9cd4b5edb6be',
          contentType: 'application/zip',
        },
      ])

      expect(form.getRawValue().headline).toBe('A headline')
      expect(
        await ((await headlineInput.getControl()) as MatInputHarness).getValue()
      ).toBe('A headline')

      expect(form.getRawValue().language).toBe('en')
      expect(
        await ((await languageInput.getControl()) as MatInputHarness).getValue()
      ).toBe('en')
    })
  })
  async function createComponent() {
    const mockUpload = {
      uploadZip: jest.fn(),
    } as jest.Mocked<Pick<WebstoryRepositoryService, 'uploadZip'>>

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
      declarations: [ZipUploadComponent, EditorWrapperComponent],
      imports: [
        NoopAnimationsModule,
        EditorComponentModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [
        {
          provide: WebstoryRepositoryService,
          useValue: mockUpload,
        },
      ],
    }).compileComponents()

    const fixture = TestBed.createComponent(EditorWrapperComponent)
    fixture.detectChanges()

    const mockWebStoryForm = EditorHarness.DEFAULT_MOCK_DOCUMENT_FROM_FORM()
    return {
      component: fixture.componentInstance,
      fixture,
      harness: await TestbedHarnessEnvironment.harnessForFixture(
        fixture,
        EditorHarness
      ),
      mockUpload,
      mockGetWebstory: EditorHarness.DEFAULT_MOCK_DOCUMENT(),
      uploadOver: (webstory: WebstoryZipUploaded) =>
        fixture.componentInstance.editorComponent.uploadOver(webstory),
      defaultValue: EditorHarness.DEFAULT_VALUE_DOCUMENT(),
      mockWebStoryForm,
      documentNext$: fixture.componentInstance.document$,
      form: fixture.componentInstance.editorComponent?.form,
    }
  }

  @Component({
    template: `<webstory-editor
        *ngIf="document$"
        [webstory]="document$ | async"
        [template]="transitions"
        (formSubmit)="workflow($event)"
        [error]="error$ | async"
        [formTitle]="title"
      ></webstory-editor>

      <ng-template #transitions let-form="form" let-disabled="disabled">
        <button
          mat-button
          type="submit"
          [disabled]="form.invalid || submitDisabled"
        >
          Send
        </button>
      </ng-template>`,
  })
  class EditorWrapperComponent {
    @ViewChild(EditorComponent)
    editorComponent!: EditorComponent

    error$: Observable<string> | undefined

    title = ''

    document$ = new Subject<WebStory>()

    workflow(_: unknown) {
      return
    }
  }
})
