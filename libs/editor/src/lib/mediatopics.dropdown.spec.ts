import { AvailableLanguage } from '@webstory/iris-uri'
import { NgSelectComponent } from '@ng-select/ng-select'
/* eslint-disable @angular-eslint/component-selector */
import { MetadataService } from './services/metadata.service'
import { MediatopicsDropdownDirective } from './mediatopics.dropdown'
import { Component, OnChanges, SimpleChanges } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { of } from 'rxjs'

@Component({
  template: `<div></div>`,
  selector: 'ng-select',
})
class NgSelectMockComponent implements OnChanges {
  // eslint-disable-next-line
  ngOnChanges(changes: SimpleChanges): void {
    // do nothing
  }

  detectChanges(): void {
    //do nothing
  }
}

@Component({
  template: `<ng-select mediatopics [selectedLang]="lang"></ng-select> `,
  providers: [{ provide: NgSelectComponent, useClass: NgSelectMockComponent }],
})
class HostComponent {
  lang = 'en'
}

describe(MediatopicsDropdownDirective.name, () => {
  it('doit fetch les mediatopics en anglais par défaut', async () => {
    const { mockFetchMediatopics } = await createComponent()
    expect(mockFetchMediatopics.getMediatopics).toHaveBeenCalledWith('en')
  })
  it('doit réagir en cas de changement de langue', async () => {
    const { setLang, fixture, mockFetchMediatopics } = await createComponent()
    // default call..
    expect(mockFetchMediatopics.getMediatopics).lastCalledWith('en')
    setLang('fr')
    fixture.detectChanges()
    expect(mockFetchMediatopics.getMediatopics).toHaveBeenCalledWith('fr')
    setLang('en')
    expect(mockFetchMediatopics.getMediatopics).toHaveBeenCalledWith('en')
  })

  async function createComponent() {
    const mockFetchMediatopics = {
      getMediatopics: jest.fn(),
    } as jest.Mocked<Pick<MetadataService, 'getMediatopics'>>

    mockFetchMediatopics.getMediatopics.mockImplementation(() => of([]))

    await TestBed.configureTestingModule({
      declarations: [
        MediatopicsDropdownDirective,
        HostComponent,
        NgSelectMockComponent,
      ],
      providers: [
        {
          provide: MetadataService,
          useValue: mockFetchMediatopics,
        },
      ],
    }).compileComponents()

    const fixture = TestBed.createComponent(HostComponent)
    fixture.detectChanges()

    return {
      component: fixture.componentInstance,
      fixture,
      mockFetchMediatopics,
      setLang: (lang: AvailableLanguage) => {
        fixture.componentInstance.lang = lang
        fixture.detectChanges()
      },
    }
  }
})
