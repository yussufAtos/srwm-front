import { environment } from './../environments/environment'
import { InfoApiService } from './service/info-api.service'
import { AuthInterceptor } from './service/auth.intercepter'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from '../apps-routing.module'
import { InfoApplication } from '@webstory/shared'
import { ApiPrefixInterceptor } from './service/api-prefixer-dev'

const intercepters = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
]

if (!environment.production) {
  intercepters.push({
    provide: HTTP_INTERCEPTORS,
    useClass: ApiPrefixInterceptor,
    multi: true,
  })
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: InfoApplication, useClass: InfoApiService },
    ...intercepters,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
