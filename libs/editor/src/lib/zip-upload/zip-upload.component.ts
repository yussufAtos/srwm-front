import { MatProgressBarModule } from '@angular/material/progress-bar'
import {
  Component,
  ChangeDetectionStrategy,
  NgModule,
  Output,
  EventEmitter,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpErrorResponse, HttpEventType } from '@angular/common/http'
import { finalize, Subject } from 'rxjs'
import { MatButtonModule } from '@angular/material/button'
import { WebstoryRepositoryService } from '../services/webstory-repository.service'
import { WebstoryZipUploaded } from '../editor/editor-form.model'

@Component({
  selector: 'webstory-zip-upload',
  templateUrl: './zip-upload.component.html',
  styleUrls: ['./zip-upload.component.scss'],
  providers: [WebstoryRepositoryService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZipUploadComponent {
  constructor(private editorUploadService: WebstoryRepositoryService) {}

  zipFile: File | undefined

  uploadProgress$: Subject<number> = new Subject()

  errors$: Subject<string> = new Subject()

  @Output()
  uploadFinished: EventEmitter<WebstoryZipUploaded> = new EventEmitter()

  @Output()
  errors: EventEmitter<string> = new EventEmitter()

  onFileChange(file: File) {
    if (file) {
      this.zipFile = file
      this.editorUploadService
        .uploadZip(this.zipFile)
        .pipe(finalize(() => this.uploadProgress$.next(0)))
        .subscribe({
          next: (httpEvent) => {
            if (
              httpEvent.type === HttpEventType.UploadProgress &&
              httpEvent.total
            ) {
              this.uploadProgress$.next(
                Math.round(100 * (httpEvent.loaded / httpEvent.total))
              )
            } else if (httpEvent.type === HttpEventType.Response) {
              this.uploadProgress$.next(0)
              if (httpEvent.body) {
                this.uploadFinished.emit({
                  ...httpEvent.body,
                })
              }
            }
          },
          error: (errors: HttpErrorResponse) => {
            this.errors.emit(errors.error.message)
          },
        })
    }
  }
}

@NgModule({
  imports: [CommonModule, MatProgressBarModule, MatButtonModule],
  declarations: [ZipUploadComponent],
  exports: [ZipUploadComponent],
})
export class ZipUploadComponentModule {}
