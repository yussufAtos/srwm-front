import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core'

@Component({
  selector: 'webstory-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainViewComponent {}

@NgModule({
  declarations: [MainViewComponent],
  imports: [CommonModule, RouterModule],
  exports: [MainViewComponent],
})
export class MainViewComponentModule {}
