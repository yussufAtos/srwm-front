import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { render } from '@testing-library/angular'
import {
  MediatopicsWithKeywordsComponent,
  MediatopicsWithKeywordsComponentModule,
} from './mediatopics-with-keywords.component'

describe(MediatopicsWithKeywordsComponent.name, () => {
  it("doit pouvoir récupérer les keywords d'un mediatopics", async () => {
    const { component, mediatopics } = await createComponent()
    for (const mediatopic of mediatopics) {
      const keywords = component.getKeywordsFromMediatopic(mediatopic)
      expect(keywords).toBe(mediatopic.keywords['en'])
    }
  })

  it("doit pouvoir ajouter des keywords sauf si c'est un doublon", async () => {
    const { component, mediatopics, expectedKeywords } = await createComponent()

    for (const mediatopic of mediatopics) {
      component.addKeywordsOf(mediatopic)
    }

    const keywords = component.keywords?.value as string[]
    expect(keywords.length).toBe(3)
    expect(keywords).toEqual(expect.arrayContaining(expectedKeywords))
    for (const mediatopic of mediatopics) {
      component.addKeywordsOf(mediatopic)
    }
    const keywordsMaj = component.keywords?.value as string[]
    expect(keywordsMaj.length).toBe(3)
    expect(keywordsMaj).toEqual(expect.arrayContaining(expectedKeywords))
  })

  it('doit pouvoir supprimer les keywords', async () => {
    const { component, mediatopics } = await createComponent()
    for (const mediatopic of mediatopics) {
      component.addKeywordsOf(mediatopic)
    }
    expect((component.keywords?.value as string[]).length).toBe(3)
    for (const mediatopic of mediatopics) {
      component.removeKeywordsOf(mediatopic)
    }
    expect((component.keywords?.value as string[]).length).toBe(0)
    // check pas de bug si on veut re remove
    for (const mediatopic of mediatopics) {
      component.removeKeywordsOf(mediatopic)
    }

    expect((component.keywords?.value as string[]).length).toBe(0)
    expect(component.getKeywordsFromMediatopic(mediatopics[1]).length).toBe(1)
    for (const mediatopic of mediatopics) {
      component.addKeywordsOf(mediatopic)
    }
    expect((component.keywords?.value as string[]).length).toBe(3)
    component.removeKeywordsOf(mediatopics[1])

    expect(component.keywords?.value as string[]).toEqual(
      expect.arrayContaining(['politics', 'religion'])
    )
  })

  it('doit supprimer tous les keywords', async () => {
    const { component, mediatopics } = await createComponent()
    for (const mediatopic of mediatopics) {
      component.addKeywordsOf(mediatopic)
    }
    expect((component.keywords?.value as string[]).length).toBe(3)

    component.removeAllKeywords()
    expect((component.keywords?.value as string[]).length).toBe(0)
  })

  async function createComponent() {
    const expectedKeywords = ['politics', 'lifestyle', 'religion']
    const mediatopics = [
      {
        names: {
          en: 'disaster and accident',
        },
        keywords: {
          en: [],
        },
        lang: 'en',
        label: 'disaster and accident',
        referentialType: 'MEDIA_TOPICS',
        uri: 'http://cv.iptc.org/newscodes/mediatopic/03000000',
        id: 'medtop03000000',
        status: 'VALID',
        trigraph: 'DIS',
      },
      {
        names: {
          en: 'lifestyle and leisure',
        },
        keywords: {
          en: ['lifestyle'],
        },
        lang: 'en',
        label: 'lifestyle and leisure',
        referentialType: 'MEDIA_TOPICS',
        uri: 'http://cv.iptc.org/newscodes/mediatopic/10000000',
        id: 'medtop10000000',
        status: 'VALID',
        trigraph: 'LIF',
      },
      {
        names: {
          en: 'politics',
        },
        keywords: {
          en: ['politics'],
        },
        lang: 'en',
        label: 'politics',
        referentialType: 'MEDIA_TOPICS',
        uri: 'http://cv.iptc.org/newscodes/mediatopic/11000000',
        id: 'medtop11000000',
        status: 'VALID',
        trigraph: 'POL',
      },
      {
        names: {
          en: 'religion and belief',
        },
        keywords: {
          en: ['religion'],
        },
        lang: 'en',
        label: 'religion and belief',
        referentialType: 'MEDIA_TOPICS',
        uri: 'http://cv.iptc.org/newscodes/mediatopic/12000000',
        id: 'medtop12000000',
        status: 'VALID',
        trigraph: 'REL',
      },
    ]
    const view = await render(MediatopicsWithKeywordsComponent, {
      imports: [MediatopicsWithKeywordsComponentModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    return {
      component: view.fixture.componentInstance,
      mediatopics,
      expectedKeywords,
    }
  }
})
