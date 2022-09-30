import { MatButtonModule } from '@angular/material/button'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { Component, ChangeDetectionStrategy, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'webstory-navigation-editor',
  templateUrl: './navigation-editor.component.html',
  styleUrls: ['./navigation-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationEditorComponent {
  guid = ''

  isClickable(): boolean {
    return this.guid.trim() !== ''
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    FormsModule,
  ],
  declarations: [NavigationEditorComponent],
  exports: [NavigationEditorComponent],
})
export class NavigationEditorComponentModule {}
