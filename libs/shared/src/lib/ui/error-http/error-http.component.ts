import { RouterModule } from '@angular/router'
import { MatButtonModule } from '@angular/material/button'
import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgModule,
} from '@angular/core'
import { MatCardModule } from '@angular/material/card'

@Component({
  selector: 'afp-shared-error-http',
  templateUrl: './error-http.component.html',
  styleUrls: ['./error-http.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorHttpComponent {
  constructor(private elementRef: ElementRef) {
    this.elementRef.nativeElement.classList.add('afp-shared-error-http')
  }

  @Input()
  errorCode: number | undefined

  @Input()
  title: string | undefined = 'Page not found'

  @Input()
  message: string | undefined = ''

  @Input()
  linkRedirect = ''
}

@NgModule({
  declarations: [ErrorHttpComponent],
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  exports: [ErrorHttpComponent],
})
export class ErrorHttpModule {}
