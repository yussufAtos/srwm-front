import { AvailableLanguage } from '@webstory/iris-uri'
import { CommonModule } from '@angular/common'
import { Directive, Input, NgModule, OnDestroy, OnInit } from '@angular/core'
import { NgSelectComponent } from '@ng-select/ng-select'
import { MetadataService } from './services/metadata.service'
import { BehaviorSubject, Subject, switchMap, takeUntil } from 'rxjs'
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'ng-select[mediatopics]',
})
export class MediatopicsDropdownDirective implements OnInit, OnDestroy {
  private static DEFAULT_LANGAGE: AvailableLanguage = 'en'

  destroyed$ = new Subject()

  @Input() set selectedLang(selectedLang: AvailableLanguage | null) {
    if (selectedLang) {
      this.selectedLang$.next(selectedLang)
    } else {
      this.selectedLang$.next(MediatopicsDropdownDirective.DEFAULT_LANGAGE)
    }
  }

  private selectedLang$ = new BehaviorSubject<AvailableLanguage>(
    MediatopicsDropdownDirective.DEFAULT_LANGAGE
  )

  constructor(
    private host: NgSelectComponent,
    private metadataService: MetadataService
  ) {
    this.host.bindLabel = 'label'
    this.host.bindValue = 'uri'
    this.host.loading = true
    this.host.items = []
    this.host.placeholder = $localize`:@@dropdown.mediatopics.placeholder:Mediatopics`
    this.host.multiple = true
  }

  ngOnInit(): void {
    this.selectedLang$
      .pipe(
        switchMap((lang) => this.metadataService.getMediatopics(lang)),
        takeUntil(this.destroyed$)
      )
      .subscribe((data) => {
        this.host.ngOnChanges({
          items: {
            previousValue: [],
            currentValue: data,
            firstChange: false,
            isFirstChange: () => false,
          },
        })
        this.host.loading = false
        this.host.detectChanges()
      })
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true)
    this.destroyed$.complete()
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [MediatopicsDropdownDirective],
  exports: [MediatopicsDropdownDirective],
})
export class MediatopicsDropdownDirectiveModule {}
