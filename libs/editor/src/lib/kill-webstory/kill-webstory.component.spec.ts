import {
  KillWebstoryComponent,
  KillWebstoryComponentModule,
} from './kill-webstory.component'
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
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import {
  DialogConfirmationComponent,
  DialogConfirmationData,
} from '@webstory/shared'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { routes } from '../shell/editor.routing'
import { DefaultEditorManagerValidatorStrategy } from '../services/default-editor-manager-validator-strategy'

describe(KillWebstoryComponent.name, () => {
  it("quand le formulaire est invalide, le bouton d'édition doit être disabled", async () => {
    const { harness } = await createComponent()
    const button = await harness.getSubmitButton()
    expect(await button.getText()).toBe('Kill')
    expect(await button.isDisabled()).toBeTruthy()
  })

  it('quand le formulaire est valide, le bouton de kill doit être enabled et permettre de lancer une requête de kill avec un signal de kill', async () => {
    const {
      harness,
      mockUpload,
      mockGetWebstory,
      routerData$,
      mockWebStoryForm,
    } = await createComponent()

    routerData$.next({ document: mockGetWebstory })

    const killButton = await harness.getSubmitButton()
    expect(await killButton.isDisabled()).toBeFalsy()

    mockUpload.killWebstory.mockImplementationOnce(() => of(mockGetWebstory))

    await killButton.click()

    expect(mockWebStoryForm.pubStatus).toBe(
      'http://cv.iptc.org/newscodes/pubstatusg2/canceled'
    )
    expect(mockUpload.killWebstory).toHaveBeenCalledWith(mockWebStoryForm)
  })

  async function createComponent() {
    const mockUpload = {
      uploadZip: jest.fn(),
      killWebstory: jest.fn(),
    } as jest.Mocked<
      Pick<WebstoryRepositoryService, 'uploadZip' | 'killWebstory'>
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
        KillWebstoryComponentModule,
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
        {
          provide: MatDialog,
          useValue: {
            open() {
              return { afterClosed: () => of(true) } as MatDialogRef<
                typeof DialogConfirmationComponent
              >
            },
          },
        },
      ],
    }).compileComponents()

    const fixture = TestBed.createComponent(KillWebstoryComponent)
    fixture.detectChanges()

    // Custom, un document kill =  un document au statut canceled + signal update
    const mockWebStoryForm = EditorHarness.DEFAULT_MOCK_DOCUMENT_FROM_FORM()
    mockWebStoryForm.pubStatus =
      'http://cv.iptc.org/newscodes/pubstatusg2/canceled'
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
      mockGetWebstory: EditorHarness.DEFAULT_MOCK_DOCUMENT(),
      defaultValue: EditorHarness.DEFAULT_VALUE_DOCUMENT(),
      mockWebStoryForm,
      location,
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

          it("le dialog s'ouvre avec un texte pour expliquer que le dialog client est vide, l'utilisateur refuse ensuite de pousuivre l'opération de kill en annulant l'action dans le dialog", async () => {
            const {
              mockModal,
              component,
              mockWebstoryRepository,
              mockWebstoryFromForm,
            } = fixture

            mockModal.open.mockReturnValue({
              afterClosed: () => of(''), // refus
            } as MatDialogRef<typeof DialogConfirmationComponent>)

            component.killWebStory(mockWebstoryFromForm)

            // premier appel second param...
            expect(
              (mockModal.open.mock.calls[0][1]?.data as DialogConfirmationData)
                .content
            ).toMatch(/editorial/i)
            expect(
              (mockModal.open.mock.calls[0][1]?.data as DialogConfirmationData)
                .content
            ).toMatch(/You are about to kill this story./i)

            expect(mockModal.open).toHaveBeenCalledTimes(1)
            expect(mockWebstoryRepository.killWebstory).not.toHaveBeenCalled()
          })

          it("doit ouvrir un dialog avec un texte pour expliquer que le dialog client est vide et que nous sommes dans un workflow de kill, l'utilisateur accepte ensuite de pousuivre l'opération de kill en continuant l'action dans le dialog", async () => {
            const {
              mockModal,
              component,
              mockWebstoryRepository,
              mockWebstoryFromForm,
            } = fixture

            mockModal.open.mockReturnValue({
              afterClosed: () => of(true),
            } as MatDialogRef<typeof DialogConfirmationComponent>)

            component.killWebStory(mockWebstoryFromForm)

            expect(
              (mockModal.open.mock.calls[0][1]?.data as DialogConfirmationData)
                .content
            ).toMatch(/editorial/i)

            expect(
              (mockModal.open.mock.calls[0][1]?.data as DialogConfirmationData)
                .content
            ).toMatch(/You are about to kill this story./i)

            expect(mockModal.open).toHaveBeenCalledTimes(1)

            expect(mockWebstoryRepository.killWebstory).toHaveBeenCalledTimes(1)
          })
        }
      )

      describe("le dialog client n'est pas vide", () => {
        beforeEach(() => {
          fixture.mockGetWebstory.edNote =
            "Problème de typo sur l'orthographe de Kiev"
        })

        it("doit afficher un dialog sans mention de l'editorial note", () => {
          const {
            mockModal,
            component,
            mockGetWebstory,
            mockWebstoryRepository,
          } = fixture

          mockModal.open.mockReturnValue({
            afterClosed: () => of(''), // refus
          } as MatDialogRef<typeof DialogConfirmationComponent>)

          component.killWebStory(mockGetWebstory)

          expect(mockModal.open).toHaveBeenCalledTimes(1)

          expect(
            (mockModal.open.mock.calls[0][1]?.data as DialogConfirmationData)
              .content
          ).not.toMatch(/editorial/i)

          expect(
            (mockModal.open.mock.calls[0][1]?.data as DialogConfirmationData)
              .content
          ).toMatch(/You are about to kill this story./i)
          expect(mockWebstoryRepository.killWebstory).not.toHaveBeenCalled()
        })
      })

      async function createShallowComponent() {
        const mockWebstoryRepository = {
          killWebstory: jest.fn(),
        } as jest.Mocked<Pick<WebstoryRepositoryService, 'killWebstory'>>

        const routerData$ = new BehaviorSubject({
          document: {},
        } as WebStoryApiResolverData)

        const mockModal = {
          open: jest.fn(),
        } as jest.Mocked<Pick<MatDialog, 'open'>>
        await TestBed.configureTestingModule({
          declarations: [KillWebstoryComponent],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          imports: [RouterTestingModule],
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

        const fixture = TestBed.createComponent(KillWebstoryComponent)

        fixture.detectChanges()

        return {
          component: fixture.componentInstance,
          fixture,
          mockWebstoryRepository,
          mockModal,
          mockGetWebstory: EditorHarness.DEFAULT_MOCK_DOCUMENT(),
          mockWebstoryFromForm: EditorHarness.DEFAULT_MOCK_DOCUMENT_FROM_FORM(),
        }
      }
    })
  })
})
