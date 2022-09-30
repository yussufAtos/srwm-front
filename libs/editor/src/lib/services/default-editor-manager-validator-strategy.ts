import { Injectable } from '@angular/core'
import { UntypedFormGroup } from '@angular/forms'
import { EditorFormModel } from '../editor/editor-form.model'

@Injectable({ providedIn: 'root' })
export class DefaultEditorManagerValidatorStrategy {
  addValidator(form: UntypedFormGroup, editorFormModel: EditorFormModel): void {
    return
  }
}
