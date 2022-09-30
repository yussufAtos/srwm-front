import { TestBed } from '@angular/core/testing'
import {
  VersionInfoComponent,
  VersionInfoComponentModule,
} from './version-info.component'
import { of } from 'rxjs'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { screen } from '@testing-library/dom'
import { InfoApplication } from './info-application'

describe(VersionInfoComponent.name, () => {
  it('doit afficher la version du back et du front', async () => {
    await createComponent()
    screen.getByText(/applicationback : 0\.1/i)
    screen.getByText(/applicationfront : 0\.2/i)
  })
  async function createComponent() {
    await TestBed.configureTestingModule({
      declarations: [VersionInfoComponent],
      imports: [VersionInfoComponentModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: InfoApplication,
          useValue: {
            backInfo: () => of({ name: 'applicationBack', version: '0.1' }),
            frontInfo: () => of({ name: 'applicationFront', version: '0.2' }),
          } as InfoApplication,
        },
      ],
    }).compileComponents()

    const fixture = TestBed.createComponent(VersionInfoComponent)

    fixture.detectChanges()

    return {
      component: fixture.componentInstance,
    }
  }
})
