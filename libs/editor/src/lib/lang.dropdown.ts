import { CommonModule } from '@angular/common'
import { Directive, NgModule, OnInit } from '@angular/core'
import { NgSelectComponent } from '@ng-select/ng-select'
import { MetadataService } from './services/metadata.service'
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'ng-select[lang]',
})
export class LangDropdownDirective implements OnInit {
  constructor(
    private host: NgSelectComponent,
    private metadataService: MetadataService
  ) {
    this.host.bindLabel = 'label'
    this.host.bindValue = 'value'
    this.host.loading = true
    this.host.items = []
    this.host.placeholder = $localize`:@@dropdown.lang.placeholder:Select a lang`
  }

  ngOnInit(): void {
    const langs = this.metadataService.getLangs()
    this.host.ngOnChanges({
      items: {
        previousValue: [],
        currentValue: langs,
        firstChange: false,
        isFirstChange: () => false,
      },
    })

    this.host.loading = false
    this.host.detectChanges()
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [LangDropdownDirective],
  exports: [LangDropdownDirective],
})
export class LangDropdownDirectiveModule {}
