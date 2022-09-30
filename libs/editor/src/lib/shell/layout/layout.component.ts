import { MainViewComponentModule } from './../main-view/main-view.component'
import { RouterModule } from '@angular/router'
import { FooterComponentModule } from './../footer/footer.component'
import { Component, ChangeDetectionStrategy, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'webstory-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}

@NgModule({
  imports: [
    CommonModule,
    FooterComponentModule,
    RouterModule,
    MainViewComponentModule,
  ],
  declarations: [LayoutComponent],
  exports: [LayoutComponent],
})
export class LayoutComponentModule {}
