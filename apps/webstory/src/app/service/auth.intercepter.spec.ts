import { TestBed } from '@angular/core/testing'
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http'

import { AuthInterceptor } from './auth.intercepter'
import { lastValueFrom } from 'rxjs'

// eslint-disable-next-line jest/valid-title
describe(AuthInterceptor.name, () => {
  let intercepter: Awaited<ReturnType<typeof createIntercepter>>

  beforeEach(async () => {
    global.window = Object.create(window)
    const url = 'http://dummy.com'
    Object.defineProperty(window, 'location', {
      value: {
        href: url,
      },
      writable: true,
    })
    intercepter = await createIntercepter()
  })
  it("doit changer de page lors d'une erreur 401", async () => {
    const { http, httpMock } = intercepter

    const request = lastValueFrom(http.get('/documents', {}))

    httpMock.expectOne('/documents').flush('', {
      status: 401,
      statusText: 'forbidden',
    })

    expect(window.location.href).toEqual(
      'http://vspar-iris-d-wsback-31.afp.com:8585/login'
    )
  })

  async function createIntercepter() {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HttpClientModule,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      ],
    })

    return {
      http: TestBed.inject(HttpClient),
      httpMock: TestBed.inject(HttpTestingController),
    }
  }
})
