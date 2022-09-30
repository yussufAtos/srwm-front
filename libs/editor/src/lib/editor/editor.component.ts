import { MediatopicsDropdownDirectiveModule } from './../mediatopics.dropdown'
import { LangDropdownDirectiveModule } from './../lang.dropdown'
import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms'
import { EditorManagerService } from '../services/editor-manager.service'
import { MatButtonModule } from '@angular/material/button'
import { ZipUploadComponentModule } from '../zip-upload/zip-upload.component'
import { NgSelectModule } from '@ng-select/ng-select'
import { AvailableLanguage, WebStory } from '@webstory/iris-uri'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { InstructionsBannerModule } from '@webstory/shared'
import { ErrorHttp } from '../models/error'
import { WebstoryZipUploaded } from './editor-form.model'
import {
  jnewsToEditorForm,
  editorFormToJnews,
  isPoster,
  isWebstoryZip,
} from './utils/editor-webstory-utils'

@Component({
  selector: 'webstory-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  providers: [EditorManagerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent {
  form: UntypedFormGroup

  webstoryUrl = ''

  private _webstory: WebStory | null = null

  _iconUrl: string | undefined

  set iconUrl(iconUrl: string | undefined) {
    this._iconUrl = iconUrl
    setTimeout(() => this.changeDetector.markForCheck(), 500)
  }

  get iconUrl() {
    return this._iconUrl
  }

  @ViewChild('poster')
  poster: ElementRef | undefined

  @Input()
  set webstory(value: WebStory | null) {
    this._webstory = value
    if (this._webstory && Object.keys(this._webstory).length > 0) {
      this.iconUrl = this._webstory.icons.find(isPoster)?.href
      this.setValue(this._webstory)
    }
  }

  @Input() template!: TemplateRef<{ disabled: false; form: UntypedFormGroup }>

  @Input()
  error: ErrorHttp | undefined | null

  // Double utilisation un peu moche => cas erreur zip + même zip url dans le workflow de kill
  @Input()
  errorUploadZip: string | undefined

  @Output()
  formSubmit: EventEmitter<WebStory> = new EventEmitter()

  @Input()
  formTitle = ''

  get title(): AbstractControl | null {
    return this.form.get('title')
  }

  get mediatopics(): AbstractControl | null {
    return this.form.get('mediatopics')
  }

  get lang(): AbstractControl | null {
    return this.form.get('language')
  }

  get langValue(): AvailableLanguage {
    return this.lang?.value ?? 'en'
  }

  get guid(): string {
    return this.form.get('guid')?.value
  }

  get remoteContents(): UntypedFormArray | null {
    return this.form.get('remoteContents') as UntypedFormArray
  }

  constructor(
    private editorManager: EditorManagerService,
    private _snackBar: MatSnackBar,
    private changeDetector: ChangeDetectorRef
  ) {
    this.form = this.editorManager.buildForm()
  }

  uploadOver(webstory: WebstoryZipUploaded) {
    this.errorUploadZip = ''

    const remoteContentZip = webstory.remoteContents?.find(isWebstoryZip)

    this.webstoryUrl =
      webstory.remoteContents?.find((el) => el.contentType === 'text/html')
        ?.href || ''

    if (webstory.icons) {
      this.iconUrl = webstory.icons.find(isPoster)?.href
      this.editorManager.setIcons(this.form, webstory.icons)
    }

    if (webstory.contentLanguage) {
      this.editorManager.changeLanguage(this.form, webstory.contentLanguage)
    }

    if (remoteContentZip) {
      this.editorManager.setRemoteContents(
        this.form,
        webstory.remoteContents.filter(isWebstoryZip)
      )
    } else {
      // TODO add Obs error
      console.error("error, remote content can't be undefined")
    }

    if (webstory.headline) {
      this.editorManager.changeTitle(this.form, webstory.headline)
    }

    this._snackBar.open(
      'An amp file have been uploaded and attached',
      undefined,
      {
        duration: 2000,
      }
    )
  }

  setValue(value: WebStory): void {
    this.editorManager.setValue(this.form, jnewsToEditorForm(value))
  }

  submit(): void {
    if (this.form.valid) {
      const webstory = editorFormToJnews(this.form.getRawValue())
      this.formSubmit.emit(webstory)
    }
  }

  onErrorsUploadZip(message: string) {
    this.errorUploadZip = message
  }
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    NgSelectModule,
    LangDropdownDirectiveModule,
    MediatopicsDropdownDirectiveModule,
    ZipUploadComponentModule,
    MatSnackBarModule,
    InstructionsBannerModule,
  ],
  declarations: [EditorComponent],
  exports: [EditorComponent],
})
export class EditorComponentModule {}
