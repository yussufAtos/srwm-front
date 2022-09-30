import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import {
  ZipUploadComponent,
  ZipUploadComponentModule,
} from './zip-upload.component'
import { render, screen } from '@testing-library/angular'
import {
  HttpEvent,
  HttpEventType,
  HttpProgressEvent,
  HttpResponse,
} from '@angular/common/http'
import { Subject } from 'rxjs'
import { WebstoryRepositoryService } from '../services/webstory-repository.service'
import { WebstoryZipUploaded } from '../editor/editor-form.model'

describe(ZipUploadComponent.name, () => {
  it("la progress bar ne doit pas être visible à l'initialisation ", async () => {
    const { progressBar } = await createComponent()
    expect(progressBar.queryProgressBar()).toBeNull()
  })

  it("la progress bar doit évoluer selon l'observable uploadProgress$", async () => {
    const { progressBar, component, fixture } = await createComponent()
    expect(progressBar.queryProgressBar()).toBeNull()

    component.uploadProgress$.next(10)
    fixture.detectChanges()
    expect(progressBar.queryProgressBar()).toBeTruthy()
    expect(progressBar.getProgressBarValue()).toBe('10')

    component.uploadProgress$.next(95)
    fixture.detectChanges()
    expect(progressBar.getProgressBarValue()).toBe('95')
  })

  it("doit lancer l'upload", async () => {
    const {
      fixture,
      component,
      file,
      mockUpload,
      progressBar,
      uploadFinishedSpy,
    } = await createComponent()

    const subject = new Subject<HttpEvent<WebstoryZipUploaded>>()

    mockUpload.uploadZip.mockReturnValueOnce(subject)

    component.onFileChange(file)

    subject.next({
      type: HttpEventType.UploadProgress,
      loaded: 1,
      total: 10,
    } as HttpProgressEvent)

    fixture.detectChanges()

    expect(progressBar.getProgressBarValue()).toBe('10')

    subject.next({
      type: HttpEventType.UploadProgress,
      loaded: 10,
      total: 10,
    } as HttpProgressEvent)

    fixture.detectChanges()

    expect(progressBar.getProgressBarValue()).toBe('100')

    const body = {
      headline: 'Patrick Balkany retourne en Prison',
      //GUID: 'FGH',
      remoteContents: [
        {
          href: 'urlzip',
          contentType: 'application/zip',
        },
        {
          href: 'https://www.afp.com/communication/webstories/balkany/story.html',
          contentType: 'text/html',
        },
      ],
      icons: [
        {
          href: 'http://vspar-iris-integ-scom.afp.com:8080/components/7c55d0643b13a191292da8a5a55e257afa285ea5',
          contentType: 'image/png',
        },
      ],
    } as WebstoryZipUploaded

    subject.next({
      type: HttpEventType.Response,
      body: body as any,
      status: 201,
    } as HttpResponse<WebstoryZipUploaded>)

    fixture.detectChanges()

    expect(progressBar.queryProgressBar()).toBeNull()

    expect(mockUpload.uploadZip).toBeCalledTimes(1)
    expect(uploadFinishedSpy).toHaveBeenNthCalledWith(1, body)
  })
})

async function createComponent() {
  const uploadFinishedSpy = jest.fn()

  const mockUploadZip = { uploadZip: jest.fn() } as jest.Mocked<
    Pick<WebstoryRepositoryService, 'uploadZip'>
  >

  const view = await render(ZipUploadComponent, {
    imports: [ZipUploadComponentModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    componentProviders: [
      {
        provide: WebstoryRepositoryService,
        useValue: mockUploadZip,
      },
    ],
    componentProperties: {
      uploadFinished: { emit: uploadFinishedSpy } as any,
    },
  })

  return {
    component: view.fixture.componentInstance,
    fixture: view.fixture,
    uploadFinishedSpy: uploadFinishedSpy,
    mockUpload: mockUploadZip,
    progressBar: {
      getProgressBar: () => screen.getByRole('progressbar'),
      queryProgressBar: () => screen.queryByRole('progressbar'),
      getProgressBarValue: () =>
        screen.getByRole('progressbar').getAttribute('aria-valuenow'),
    },
    file: new File(['test'], 'Mock.zip', {
      type: 'application/zip',
    }),
  }
}
