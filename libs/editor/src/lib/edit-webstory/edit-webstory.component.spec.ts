import { DefaultEditorManagerValidatorStrategy } from './../services/default-editor-manager-validator-strategy'
import { MatInputHarness } from '@angular/material/input/testing'
import {
  EditWebstoryComponent,
  EditWebstoryComponentModule,
} from './edit-webstory.component'
import { ZipUploadComponent } from './../zip-upload/zip-upload.component'
import { WebstoryRepositoryService } from './../services/webstory-repository.service'
import { EditorHarness } from './../editor/editor.harness'
import { TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { BehaviorSubject, of } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { WebStoryApiResolverData } from '../webstory-api-resolver.data'
import { routes } from '../shell/editor.routing'
import { RouterTestingModule } from '@angular/router/testing'

describe(EditWebstoryComponent.name, () => {
  it("quand le formulaire est invalide, le bouton d'édition doit être disabled", async () => {
    const { harness } = await createComponent()
    const button = await harness.getSubmitButton()
    expect(await button.getText()).toBe('Validate')
    expect(await button.isDisabled()).toBeTruthy()
  })

  it("quand le formulaire est valide, le bouton d'édition doit être enabled et permettre de lancer une requête d'édition", async () => {
    const {
      harness,
      mockUpload,
      mockGetWebstory,
      mockWebStoryForm,
      routerData$,
    } = await createComponent()

    routerData$.next({ document: mockGetWebstory })

    const editButton = await harness.getSubmitButton()
    expect(await editButton.isDisabled()).toBeFalsy()

    mockUpload.editWebstory.mockImplementationOnce(() => of(mockGetWebstory))

    await editButton.click()
    expect(mockUpload.editWebstory).toHaveBeenCalledWith(mockWebStoryForm)
  })

  async function createComponent() {
    const mockUpload = {
      uploadZip: jest.fn(),
      editWebstory: jest.fn(),
    } as jest.Mocked<
      Pick<WebstoryRepositoryService, 'uploadZip' | 'editWebstory'>
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

    const routerData$ = new BehaviorSubject({
      document: {},
    } as WebStoryApiResolverData)

    await TestBed.configureTestingModule({
      declarations: [ZipUploadComponent],
      imports: [
        NoopAnimationsModule,
        EditWebstoryComponentModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [
        {
          provide: DefaultEditorManagerValidatorStrategy,
          useClass: DefaultEditorManagerValidatorStrategy,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            data: routerData$,
          },
        },
        {
          provide: WebstoryRepositoryService,
          useValue: mockUpload,
        },
      ],
    }).compileComponents()

    const fixture = TestBed.createComponent(EditWebstoryComponent)
    fixture.detectChanges()
    const mockWebStoryForm = EditorHarness.DEFAULT_MOCK_DOCUMENT_FROM_FORM()
    mockWebStoryForm.signals = [
      { uri: 'http://cv.iptc.org/newscodes/signal/update' },
    ]
    return {
      component: fixture.componentInstance,
      fixture,
      harness: await TestbedHarnessEnvironment.harnessForFixture(
        fixture,
        EditorHarness
      ),
      mockUpload,
      routerData$,
      mockWebStoryForm,
      mockGetWebstory: EditorHarness.DEFAULT_MOCK_DOCUMENT(),
      defaultFormValue: EditorHarness.DEFAULT_VALUE_DOCUMENT(),
    }
  }
})
