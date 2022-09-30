import { Injectable } from '@angular/core'
import {
  UntypedFormGroup,
  ValidatorFn,
  AbstractControl,
  UntypedFormArray,
} from '@angular/forms'
import { RemoteContent } from '@webstory/iris-uri'
import { EditorFormModel } from '../editor/editor-form.model'
import { isWebstoryZip } from '../editor/utils/editor-webstory-utils'
import { DefaultEditorManagerValidatorStrategy } from '../services/default-editor-manager-validator-strategy'

@Injectable()
export class KillEditorManagerValidatorStrategy extends DefaultEditorManagerValidatorStrategy {
  override addValidator(
    form: UntypedFormGroup,
    editorFormModel: EditorFormModel
  ): void {
    super.addValidator(form, editorFormModel)
    const zipUrl = editorFormModel.remoteContents.find(isWebstoryZip)?.href
    if (zipUrl) {
      form.addValidators(this.validateZipHasChanged(zipUrl))
    }
  }

  validateZipHasChanged(oldUrlZip: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const remoteContents = (control.get('remoteContents') as UntypedFormArray)
        .value as RemoteContent[]

      const zipRemoteContent = remoteContents.find(isWebstoryZip)

      return zipRemoteContent?.href !== oldUrlZip
        ? null
        : { zipNotChanged: control.value }
    }
  }
}
