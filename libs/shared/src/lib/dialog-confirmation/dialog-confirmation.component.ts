import { DialogConfirmationData } from './dialog-confirmation-data'
import { MatButtonModule } from '@angular/material/button'
import {
  Component,
  ChangeDetectionStrategy,
  NgModule,
  Inject,
  Optional,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'afp-shared-dialog-confirmation',
  templateUrl: './dialog-confirmation.component.html',
  styleUrls: ['./dialog-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogConfirmationComponent {
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogConfirmationData
  ) {}
}

@NgModule({
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  declarations: [DialogConfirmationComponent],
  exports: [DialogConfirmationComponent],
})
export class DialogConfirmationComponentModule {}
