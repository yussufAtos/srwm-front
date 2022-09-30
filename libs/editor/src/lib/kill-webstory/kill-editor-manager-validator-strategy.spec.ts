import { DefaultEditorManagerValidatorStrategy } from './../services/default-editor-manager-validator-strategy'
import { TestBed } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { EditorFormModel } from '../editor/editor-form.model'
import { EditorManagerService } from '../services'
import { KillEditorManagerValidatorStrategy } from './kill-editor-manager-validator-strategy'

describe(EditorManagerService.name, () => {
  let harness: ReturnType<typeof createHarness>
  beforeEach(() => (harness = createHarness()))

  function createHarness() {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        {
          provide: DefaultEditorManagerValidatorStrategy,
          useClass: KillEditorManagerValidatorStrategy,
        },
        {
          provide: EditorManagerService,
          useClass: EditorManagerService,
        },
      ],
    })
    return {
      editorManagerService: TestBed.inject(EditorManagerService),
      mockValue: {
        guid: '',
        language: 'en',
        headline: 'Patrick Balkany return to prison again.',
        catchline: 'Patrick is back !!',
        edNote: `Original source is unknown and unverified. This photo was posted on twitter.
        Following an official ban in San Theodoros on foreign media outlets covering
        demonstrations, AFP is using pictures from other sources.`,
        icons: [
          {
            href: 'http://vspar-iris-integ-scom.afp.com:8080/components/7c55d0643b13a191292da8a5a55e257afa285ea5',
            contentType: 'image/png',
          },
        ],
        remoteContents: [
          {
            href: 'http://vspar-iris-integ-scom.afp.com:8080/components/7c55d0643b13a191292da8a5a55e257afa285ea5',
            contentType: 'application/zip',
          },
        ],
        itemClass: 'http://cv.afp.com/itemnatures/webStory',
        pubStatus: 'http://cv.iptc.org/newscodes/pubstatusg2/usable',
        mediatopics: [],
      } as EditorFormModel,
      emptyFormValue: {
        guid: '',
        remoteContents: [],
        itemClass: 'http://cv.afp.com/itemnatures/webStory',
        pubStatus: 'http://cv.iptc.org/newscodes/pubstatusg2/usable',
        icons: [],
        language: '',
        edNote: '',
        catchline: '',
        headline: '',
        mediatopics: [],
      } as unknown as EditorFormModel,
    }
  }

  it('should be truthy', () => {
    const { editorManagerService } = harness
    expect(editorManagerService).toBeTruthy()
  })

  it("doit ajouter un validateur pour obliger l'utilisateur à modifier le zip", () => {
    const { editorManagerService, mockValue } = harness
    const form = editorManagerService.buildForm()
    editorManagerService.setValue(form, mockValue)
    form.updateValueAndValidity()
    expect(form.valid).toBe(false)
    expect(form.errors).toHaveProperty('zipNotChanged')

    editorManagerService.setRemoteContents(form, [
      {
        contentType: 'application/zip',
        href: 'http://vspar-iris-integ-scom.afp.com:8080/components/76njyubyyu87986yuvvt',
      },
    ])
    expect(form.valid).toBe(true)
  })
})
