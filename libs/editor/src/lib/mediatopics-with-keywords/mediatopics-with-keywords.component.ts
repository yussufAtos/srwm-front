import { AvailableLanguage } from '@webstory/iris-uri'
import { MediaTopic } from './../models/mediatopic'
import { MediatopicsDropdownDirectiveModule } from './../mediatopics.dropdown'
import { NgSelectModule } from '@ng-select/ng-select'
import {
  Component,
  ChangeDetectionStrategy,
  NgModule,
  Input,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms'

@Component({
  selector: 'webstory-mediatopics-with-keywords',
  templateUrl: './mediatopics-with-keywords.component.html',
  styleUrls: ['./mediatopics-with-keywords.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediatopicsWithKeywordsComponent {
  @Input()
  lang: AvailableLanguage = 'en'

  mediatopicsForm: FormGroup

  get mediatopics(): AbstractControl | null {
    return this.mediatopicsForm.get('mediatopics')
  }

  get keywords(): AbstractControl | null {
    return this.mediatopicsForm.get('keywords')
  }

  constructor(private fb: FormBuilder) {
    this.mediatopicsForm = this.fb.group({
      keywords: [],
      mediatopics: [],
    })
  }

  attachForm(
    parent: FormGroup,
    controlMediatopics: { name: string; value?: string },
    controlKeywords: { name: string; value?: string[] }
  ): void {
    if (this.mediatopics) {
      const value =
        controlMediatopics.value ??
        parent.get(controlMediatopics.name)?.value ??
        []

      this.mediatopics?.setValue(value)
      this.mediatopicsForm.setControl(
        controlMediatopics.name,
        parent.get(controlMediatopics.name) ?? this.mediatopics
      )
    }
    if (this.keywords) {
      const value =
        controlKeywords.value ?? parent.get(controlKeywords.name)?.value ?? []

      this.keywords?.setValue(value)
      this.keywords.disable()
      parent.setControl(controlKeywords.name, this.keywords)
    }
  }

  removeKeywordsOf(mediaTopic: MediaTopic) {
    const keywordsAttachedToMediatopics =
      this.getKeywordsFromMediatopic(mediaTopic)
    if (keywordsAttachedToMediatopics.length > 0) {
      let keywordsValue = this.keywords?.value as string[]
      keywordsValue = keywordsValue.filter(
        (key) => !keywordsAttachedToMediatopics.find((k) => key === k)
      )
      this.keywords?.setValue(keywordsValue)
    }
  }

  addKeywordsOf(mediaTopic: MediaTopic) {
    const keywordsAttachedToMediatopics =
      this.getKeywordsFromMediatopic(mediaTopic)

    if (keywordsAttachedToMediatopics.length > 0) {
      const keywordsValue = (this.keywords?.value as string[]) || []
      // filter doublon
      let tmp: string[] = [...keywordsValue, ...keywordsAttachedToMediatopics]
      tmp = tmp.filter((ele, pos) => tmp.indexOf(ele) === pos)
      this.keywords?.setValue(tmp)
    }
  }

  removeAllKeywords(): void {
    this.keywords?.setValue([])
  }

  getKeywordsFromMediatopic(mediatopic: MediaTopic): string[] {
    if (!mediatopic.keywords || !mediatopic.lang) {
      return []
    }
    return mediatopic.keywords[mediatopic.lang as AvailableLanguage] || []
  }
}

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    ReactiveFormsModule,
    MediatopicsDropdownDirectiveModule,
  ],
  declarations: [MediatopicsWithKeywordsComponent],
  exports: [MediatopicsWithKeywordsComponent],
})
export class MediatopicsWithKeywordsComponentModule {}
