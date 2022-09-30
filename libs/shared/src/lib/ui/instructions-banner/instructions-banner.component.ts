import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgModule,
} from '@angular/core'
import {
  CanColor,
  mixinColor,
  mixinDisabled,
  mixinDisableRipple,
  ThemePalette,
} from '@angular/material/core'

// Boilerplate for applying mixins to InstructionsBannerComponent.
const InstructionsBannerBase = mixinColor(
  mixinDisabled(
    mixinDisableRipple(
      class {
        constructor(public _elementRef: ElementRef) {}
      }
    )
  )
)

@Component({
  selector: 'afp-shared-instructions-banner',
  templateUrl: './instructions-banner.component.html',
  styleUrls: ['./instructions-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructionsBannerComponent
  extends InstructionsBannerBase
  implements CanColor
{
  constructor(private elementRef: ElementRef) {
    super(elementRef)
    this.elementRef.nativeElement.classList.add(
      'afp-shared-instructions-banner'
    )
  }

  /** Theme color palette for the component. */
  @Input() override color: ThemePalette = this.defaultColor

  @Input()
  title: string | undefined

  @Input()
  message: string | undefined

  @Input() uppercase = true

  /** Default color to fall back to if no value is set. */
  override defaultColor: ThemePalette | undefined = 'primary'
}

@NgModule({
  declarations: [InstructionsBannerComponent],
  imports: [CommonModule],
  exports: [InstructionsBannerComponent],
})
export class InstructionsBannerModule {}
