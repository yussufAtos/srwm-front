import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import {
  CorrectionWebstoryComponent,
  CorrectionWebstoryComponentModule,
} from './correction-webstory.component'
import { MatInputHarness } from '@angular/material/input/testing'
import { ZipUploadComponent } from './../zip-upload/zip-upload.component'
import { WebstoryRepositoryService } from './../services/webstory-repository.service'
import { EditorHarness } from './../editor/editor.harness'
import { TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { BehaviorSubject, of } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { WebStoryApiResolverData } from '../webstory-api-resolver.data'
import { RouterTestingModule } from '@angular/router/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import {
  DialogConfirmationComponent,
  DialogConfirmationData,
} from '@webstory/shared'
import { routes } from '../shell/editor.routing'
import { DefaultEditorManagerValidatorStrategy } from '../services/default-editor-manager-validator-strategy'

describe(CorrectionWebstoryComponent.name, () => {
  it('doit modifier le formulaire selon le document injecté', async () => {
    const { harness, mockFormValue, fixture, routerData$, mockGetWebstory } =
      await createComponent()

    routerData$.next({ document: mockGetWebstory })

    fixture.detectChanges()

    expect(
      await (
        (await (await harness.getHeadline()).getControl()) as MatInputHarness
      ).getValue()
    ).toBe(mockFormValue.headline)

    expect(
      await (
        (await (
          await harness.getEditorialNote()
        ).getControl()) as MatInputHarness
      ).getValue()
    ).toBe(mockFormValue.edNote)
  })
  it('quand le formulaire est invalide, le bouton de correction doit être disabled', async () => {
    const { harness } = await createComponent()
    const button = await harness.getSubmitButton()
    expect(await button.getText()).toBe('Validate')
    expect(await button.isDisabled()).toBeTruthy()
  })

  it('quand le formulaire est valide, le bouton de correction doit être enabled et permettre de lancer une requête de correction avec le signal de correction', async () => {
    const {
      harness,
      mockUpload,
      mockPostWebstoryValue,
      mockGetWebstory,
      routerData$,
    } = await createComponent()

    routerData$.next({ document: mockGetWebstory })

    const correctionButton = await harness.getSubmitButton()
    expect(await correctionButton.isDisabled()).toBeFalsy()

    mockUpload.correctionWebstory.mockImplementationOnce(() =>
      of(mockPostWebstoryValue)
    )

    await correctionButton.click()
    expect(mockUpload.correctionWebstory).toHaveBeenCalledWith(
      mockPostWebstoryValue
    )
  })

  async function createComponent() {
    const mockUpload = {
      uploadZip: jest.fn(),
      correctionWebstory: jest.fn(),
    } as jest.Mocked<
      Pick<WebstoryRepositoryService, 'uploadZip' | 'correctionWebstory'>
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
        CorrectionWebstoryComponentModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [
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
        {
          provide: MatDialog,
          useValue: MatDialog,
        },
        {
          provide: DefaultEditorManagerValidatorStrategy,
          useClass: DefaultEditorManagerValidatorStrategy,
        },
      ],
    }).compileComponents()

    const fixture = TestBed.createComponent(CorrectionWebstoryComponent)

    fixture.detectChanges()

    const mockPostWebstoryValue =
      EditorHarness.DEFAULT_MOCK_DOCUMENT_FROM_FORM()
    mockPostWebstoryValue.signals = [
      { uri: 'http://cv.iptc.org/newscodes/signal/correction' },
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
      mockPostWebstoryValue,
      mockGetWebstory: EditorHarness.DEFAULT_MOCK_DOCUMENT(),
      mockFormValue: EditorHarness.DEFAULT_VALUE_DOCUMENT(),
    }
  }

  describe('Shallow rendering', () => {
    describe('Ouverture du dialog lors du submit', () => {
      let fixture: Awaited<ReturnType<typeof createShallowComponent>>
      beforeEach(async () => {
        fixture = await createShallowComponent()
      })

      describe.each([undefined, ''])(
        "le dialog client est égal à '%s'",
        (edNote) => {
          beforeEach(async () => {
            fixture.mockWebstoryFromForm.edNote = edNote
          })

          it("doit ouvrir un dialog avec un texte pour expliquer que le dialog client est vide, l'utilisateur refuse ensuite de pousuivre l'opération d'update en annulant l'action dans le dialog", async () => {
            const {
              mockModal,
              component,
              mockWebstoryFromForm,
              mockWebstoryRepository,
            } = fixture

            mockModal.open.mockReturnValue({
              afterClosed: () => of(''), // refus
            } as MatDialogRef<typeof DialogConfirmationComponent>)

            component.correctionWebStory(mockWebstoryFromForm)

            // premier appel second param...
            expect(
              (mockModal.open.mock.calls[0][1]?.data as DialogConfirmationData)
                .content
            ).toMatch(/editorial/i)

            expect(mockModal.open).toHaveBeenCalledTimes(1)
            expect(
              mockWebstoryRepository.correctionWebstory
            ).not.toHaveBeenCalled()
          })

          it("doit ouvrir un dialog avec un texte pour expliquer que le dialog client est vide, l'utilisateur accepte ensuite de pousuivre l'opération d'update en continuant l'action dans le dialog", async () => {
            const {
              mockModal,
              component,
              mockWebstoryFromForm,
              mockWebstoryRepository,
            } = fixture

            mockModal.open.mockReturnValue({
              afterClosed: () => of(true),
            } as MatDialogRef<typeof DialogConfirmationComponent>)

            component.correctionWebStory(mockWebstoryFromForm)

            expect(
              (mockModal.open.mock.calls[0][1]?.data as DialogConfirmationData)
                .content
            ).toMatch(/editorial/i)

            expect(mockModal.open).toHaveBeenCalledTimes(1)

            expect(
              mockWebstoryRepository.correctionWebstory
            ).toHaveBeenCalledTimes(1)
          })
        }
      )

      describe("le dialog client n'est pas vide", () => {
        it("aucun dialog ne doit s'ouvrir, et un appel pour corriger la webstory est lancé", async () => {
          const {
            mockModal,
            component,
            mockWebstoryFromForm,
            mockWebstoryRepository,
          } = fixture
          mockWebstoryRepository.correctionWebstory.mockImplementation(() =>
            of()
          )

          component.correctionWebStory(mockWebstoryFromForm)
          expect(mockModal.open).not.toHaveBeenCalled()
          expect(
            mockWebstoryRepository.correctionWebstory
          ).toHaveBeenCalledTimes(1)
        })
      })
    })

    async function createShallowComponent() {
      const mockWebstoryRepository = {
        correctionWebstory: jest.fn(),
      } as jest.Mocked<Pick<WebstoryRepositoryService, 'correctionWebstory'>>

      const routerData$ = new BehaviorSubject({
        document: {},
      } as WebStoryApiResolverData)

      const mockModal = {
        open: jest.fn(),
      } as jest.Mocked<Pick<MatDialog, 'open'>>
      await TestBed.configureTestingModule({
        declarations: [CorrectionWebstoryComponent],
        imports: [RouterTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              data: routerData$,
            },
          },
          {
            provide: WebstoryRepositoryService,
            useValue: mockWebstoryRepository,
          },
          {
            provide: MatDialog,
            useValue: mockModal,
          },
        ],
      }).compileComponents()

      const fixture = TestBed.createComponent(CorrectionWebstoryComponent)

      fixture.detectChanges()

      const mockWebstoryFromForm =
        EditorHarness.DEFAULT_MOCK_DOCUMENT_FROM_FORM()
      mockWebstoryFromForm.signals = [
        { uri: 'http://cv.iptc.org/newscodes/signal/correction' },
      ]

      return {
        component: fixture.componentInstance,
        fixture,
        mockWebstoryRepository,
        mockModal,
        mockWebstoryFromForm,
        mockForm: EditorHarness.DEFAULT_VALUE_DOCUMENT(),
      }
    }
  })
})
