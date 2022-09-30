import { DefaultEditorManagerValidatorStrategy } from './default-editor-manager-validator-strategy'
import { TestBed } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { EditorFormModel } from '../editor/editor-form.model'
import { EditorManagerService } from './editor-manager.service'

describe(EditorManagerService.name, () => {
  let harness: ReturnType<typeof createHarness>
  beforeEach(() => (harness = createHarness()))

  function createHarness() {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        {
          provide: DefaultEditorManagerValidatorStrategy,
          useClass: DefaultEditorManagerValidatorStrategy,
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
            href: 'uri',
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

  describe("Lors de la création d'une nouvelle webstory", () => {
    it('doit créer un formulaire ayant des valeurs vides', () => {
      const { editorManagerService, emptyFormValue } = harness
      const form = editorManagerService.buildForm()
      expect(form.getRawValue()).toStrictEqual(emptyFormValue)
    })

    it.each(['remoteContents', 'icons'] as (keyof EditorFormModel)[])(
      'le champ %s est required',
      (i) => {
        const { editorManagerService } = harness
        const form = editorManagerService.buildForm()
        expect(form.get(i)?.hasError('required')).toBe(true)
      }
    )
  })

  describe("Lors de l'édition de la webstory", () => {
    it('doit modifier les données du formulaire', () => {
      const { editorManagerService, mockValue } = harness
      const form = editorManagerService.buildForm()
      editorManagerService.setValue(form, mockValue)
      expect(form.getRawValue()).toStrictEqual(mockValue)
    })
  })

  it('doit changer la valeur du champ remotecontent', () => {
    const { editorManagerService, mockValue } = harness
    const form = editorManagerService.buildForm()
    editorManagerService.setRemoteContents(form, mockValue.remoteContents)
    expect(form.value).toHaveProperty(
      'remoteContents',
      mockValue.remoteContents
    )
  })

  it('doit changer la valeur du champ icons', () => {
    const { editorManagerService, mockValue } = harness
    const form = editorManagerService.buildForm()
    editorManagerService.setIcons(form, mockValue.icons)
    expect(form.value).toHaveProperty('icons', mockValue.icons)
  })

  it('doit changer la valeur du champ headline', () => {
    const { editorManagerService, mockValue } = harness
    const form = editorManagerService.buildForm()
    editorManagerService.changeTitle(form, mockValue.headline)
    expect(form.getRawValue()).toHaveProperty('headline', mockValue.headline)
  })
})
