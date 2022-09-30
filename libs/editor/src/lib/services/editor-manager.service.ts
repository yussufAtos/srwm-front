import { Injectable } from '@angular/core'
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms'
import {
  EditorFormModel,
  RemoteContentFormModel,
  WebStoryType,
} from '../editor/editor-form.model'
import { DefaultEditorManagerValidatorStrategy } from './default-editor-manager-validator-strategy'

@Injectable({ providedIn: 'any' })
export class EditorManagerService {
  constructor(
    private fb: UntypedFormBuilder,
    private defaultEditorManagerValidatorStrategy: DefaultEditorManagerValidatorStrategy
  ) {}

  buildForm(): UntypedFormGroup {
    return this.fb.group({
      guid: [''],
      headline: [{ value: '', disabled: true }, [Validators.required]],
      language: [{ value: '', disabled: true }, [Validators.required]],
      edNote: [''],
      catchline: [''],
      pubStatus: [
        'http://cv.iptc.org/newscodes/pubstatusg2/usable',
        Validators.required,
      ],
      itemClass: [
        'http://cv.afp.com/itemnatures/webStory' as WebStoryType,
        [Validators.required],
      ],
      remoteContents: this.fb.array(
        [],
        [Validators.required, Validators.minLength(1)]
      ),
      icons: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      mediatopics: [[]],
    })
  }

  setValue(form: UntypedFormGroup, value: EditorFormModel): void {
    for (const key of Object.keys(value)) {
      const fieldValue = value[key as keyof EditorFormModel]
      const fieldControl = form.get(key)
      if (fieldControl) {
        if (
          (key as keyof EditorFormModel) === 'icons' ||
          (key as keyof EditorFormModel) === 'remoteContents'
        ) {
          this.setRemoteRessource(
            fieldControl as UntypedFormArray,
            fieldValue as RemoteContentFormModel[]
          )
        } else {
          fieldControl.patchValue(fieldValue)
        }
      } else {
        // console.error(`${key} is not a valid form control.`)
      }
    }
    this.defaultEditorManagerValidatorStrategy.addValidator(form, value)
  }

  setRemoteContents(
    form: UntypedFormGroup,
    remoteContents: RemoteContentFormModel[]
  ): void {
    const formRemoteContent = form.get('remoteContents') as UntypedFormArray
    this.setRemoteRessource(formRemoteContent, remoteContents)
  }

  setIcons(form: UntypedFormGroup, icons: RemoteContentFormModel[]) {
    const formIcons = form.get('icons') as UntypedFormArray
    this.setRemoteRessource(formIcons, icons)
  }

  private setRemoteRessource(
    form: UntypedFormArray,
    arr: RemoteContentFormModel[]
  ): void {
    form.clear()
    for (const el of arr) {
      const group = this.fb.group({
        href: [el.href, [Validators.required]],
        contentType: [el.contentType, [Validators.required]],
      })
      if (el.rendition) {
        group.addControl('rendition', this.fb.control(el.rendition))
      }
      form.push(group)
    }
  }

  changeTitle(form: UntypedFormGroup, title: string): void {
    form.get('headline')?.patchValue(title)
  }

  changeLanguage(form: UntypedFormGroup, language: string) {
    form.get('language')?.patchValue(language)
  }
}
