import { Injectable } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable()
/**
 * Prefix URL for angular proxy. ONLY FOR DEV
 */
export class ApiPrefixInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const apiReq = req.clone({ url: `/dev${req.url}` })
    return next.handle(apiReq)
  }
}
