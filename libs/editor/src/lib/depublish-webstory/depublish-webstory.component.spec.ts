import { screen } from '@testing-library/angular'
import { WebStoryFullViewHarness } from './../webstory-full-view/webstory-full-view.component.harness'
import {
  DepublishWebstoryComponent,
  DepublishWebstoryComponentModule,
} from './depublish-webstory.component'
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
import { routes } from '../shell/editor.routing'
describe(DepublishWebstoryComponent.name, () => {
  it('doit afficher le document et le bouton de retour et de depublish', async () => {
    const { harness, mockGetWebstory, mockUpload } = await createComponent()

    // test sommaire pour vérifier que le document est affiché
    expect(await (await harness.getGuid()).text()).toContain(
      mockGetWebstory.guid
    )
    expect(screen.getByRole('button', { name: /depublish/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDefined()

    mockUpload.depublish.mockImplementation(() => of())

    screen.getByRole('button', { name: /depublish/i }).click()

    expect(mockUpload.depublish).toHaveBeenCalledTimes(1)
    expect(mockUpload.depublish).toHaveBeenCalledWith(mockGetWebstory.guid)
  })

  async function createComponent() {
    const mockUpload = {
      depublish: jest.fn(),
    } as jest.Mocked<Pick<WebstoryRepositoryService, 'depublish'>>

    const mockGetWebstory = EditorHarness.DEFAULT_MOCK_DOCUMENT()

    const routerData$ = new BehaviorSubject({
      document: mockGetWebstory,
    } as WebStoryApiResolverData)

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        DepublishWebstoryComponentModule,
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
      ],
    }).compileComponents()

    const fixture = TestBed.createComponent(DepublishWebstoryComponent)

    fixture.detectChanges()

    return {
      component: fixture.componentInstance,
      fixture,
      harness: await TestbedHarnessEnvironment.harnessForFixture(
        fixture,
        WebStoryFullViewHarness
      ),
      mockUpload,
      routerData$,
      mockGetWebstory,
    }
  }

  describe.skip('Shallow rendering', () => {
    let fixture: Awaited<ReturnType<typeof createShallowComponent>>
    beforeEach(async () => {
      fixture = await createShallowComponent()
    })
    it('doit lancer un appel pour depublier la webstory', async () => {
      const { component, mockWebstoryFromForm, mockWebstoryRepository } =
        fixture
      mockWebstoryRepository.depublish.mockImplementation(() => of())
      component.depublishWebstory(mockWebstoryFromForm.guid)
      expect(mockWebstoryRepository.depublish).toHaveBeenCalledTimes(1)
    })
  })

  async function createShallowComponent() {
    const mockWebstoryRepository = {
      depublish: jest.fn(),
    } as jest.Mocked<Pick<WebstoryRepositoryService, 'depublish'>>

    const routerData$ = new BehaviorSubject({
      document: {},
    } as WebStoryApiResolverData)

    await TestBed.configureTestingModule({
      declarations: [DepublishWebstoryComponent],
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
      ],
    }).compileComponents()

    const fixture = TestBed.createComponent(DepublishWebstoryComponent)

    fixture.detectChanges()

    return {
      component: fixture.componentInstance,
      fixture,
      mockWebstoryRepository,
      mockForm: EditorHarness.DEFAULT_VALUE_DOCUMENT(),
      mockWebstoryFromForm: EditorHarness.DEFAULT_MOCK_DOCUMENT_FROM_FORM(),
    }
  }
})
