import { WebStoryFullViewHarness } from './webstory-full-view.component.harness'
import {
  WebStoryFullView,
  WebstoryFullViewComponent,
  WebstoryFullViewComponentModule,
} from './webstory-full-view.component'
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { render } from '@testing-library/angular'

describe(WebstoryFullViewComponent.name, () => {
  it('doit afficher un document de type webstory..', async () => {
    const { harness, webstory } = await createComponent()
    expect(await (await harness.getHeadline()).text()).toBe(webstory.headline)

    expect(await (await harness.getCatchline()).text()).toContain(
      webstory.catchline
    )
    expect(await (await harness.getGuid()).text()).toContain(webstory.guid)

    expect(await (await harness.getLanguage()).text()).toBe(webstory.language)
    // todo chercher await error
    // expect(await harness.getPubStatus()).toBe(webstory.pubStatus)
    expect(await (await harness.getVersion()).text()).toBe(
      'Version ' + webstory.version
    )

    expect(await (await harness.getCorrection()).text()).toBe('correction')
    expect(await (await harness.getDate()).text()).toContain('May 9, 2022')
  })

  it('doit afficher killed pour une webstory cancelled', async () => {
    const { harness, fixture, detectChanges } = await createComponent()
    if (fixture.componentInstance.webstory) {
      fixture.componentInstance.webstory.pubStatus = 'CANCELED'
    }
    expect(await (await harness.getPubStatus()).text()).toBe('Killed')
  })

  async function createComponent() {
    const webstory: WebStoryFullView = {
      guid: 'http://d.afp.com/3FQ28Q',
      edNote: 'A general editorial note (aka dialogue client)',
      headline: 'A headline',
      catchline: 'A catchline',
      posterUrl:
        'http://vspar-iris-integ-scom.afp.com:8080/components/7c55d0643b13a191292da8a5a55e257afa285ea5',
      itemClass: 'http://cv.afp.com/itemnatures/webStory',
      language: 'en',
      mediatopics: [
        {
          uri: 'http://cv.iptc.org/newscodes/mediatopic/16000000',
          type: 'http://cv.iptc.org/newscodes/cpnature/abstract',
          name: 'conflicts, war and peace',
        },
        {
          uri: 'http://cv.iptc.org/newscodes/mediatopic/04000000',
          type: 'http://cv.iptc.org/newscodes/cpnature/abstract',
          name: 'economy, business and finance',
        },
      ],
      pubStatus: 'CANCELED',
      version: 1,
      versionCreated: '2022-05-09T17:34:58Z',
      signals: ['correction'],
    }
    const { fixture, detectChanges, change } = await render(
      WebstoryFullViewComponent,
      {
        componentProperties: { webstory },
        imports: [WebstoryFullViewComponentModule],
      }
    )

    detectChanges()

    return {
      fixture,
      change,
      detectChanges,
      harness: await TestbedHarnessEnvironment.harnessForFixture(
        fixture,
        WebStoryFullViewHarness
      ),
      webstory,
    }
  }
})
