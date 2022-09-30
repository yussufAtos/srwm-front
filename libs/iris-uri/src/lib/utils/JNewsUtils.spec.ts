import { DocumentJnews } from '../jnews'
import { applySignal } from './JNewsUtils'

describe('JNews utils', () => {
  it("doit ajouter le signal de correction s'il n'existe pas", () => {
    const document: Partial<DocumentJnews> = { guid: 'VGGVIO', signals: [] }

    const documentExpected: Partial<DocumentJnews> = {
      guid: 'VGGVIO',
      signals: [{ uri: 'http://cv.iptc.org/newscodes/signal/correction' }],
    }

    expect(
      applySignal(
        document as DocumentJnews,
        'http://cv.iptc.org/newscodes/signal/correction'
      )
    ).toStrictEqual(documentExpected)

    // on vérifie que ça ne l'ajoute pas * 2
    expect(
      applySignal(
        document as DocumentJnews,
        'http://cv.iptc.org/newscodes/signal/correction'
      )
    ).toStrictEqual(documentExpected)

    documentExpected.signals?.push({
      uri: 'http://cv.iptc.org/newscodes/signal/cwarn',
    })
    expect(
      applySignal(
        document as DocumentJnews,
        'http://cv.iptc.org/newscodes/signal/cwarn'
      )
    ).toStrictEqual(documentExpected)
  })

  it("doit supprimer le signal d'update si on ajoute un signal de correction", () => {
    const document: Pick<DocumentJnews, 'guid' | 'signals'> = {
      guid: 'VGGVIO',
      signals: [
        { uri: 'http://cv.iptc.org/newscodes/signal/update' },
        { uri: 'http://cv.iptc.org/newscodes/signal/cwarn' },
      ],
    }

    const documentExpected: Partial<DocumentJnews> = {
      guid: 'VGGVIO',
      signals: [
        { uri: 'http://cv.iptc.org/newscodes/signal/cwarn' },
        { uri: 'http://cv.iptc.org/newscodes/signal/correction' },
      ],
    }

    expect(
      applySignal(
        document as DocumentJnews,
        'http://cv.iptc.org/newscodes/signal/correction'
      )
    ).toStrictEqual(documentExpected)
  })

  it("doit supprimer le signal de correction si on ajoute un signal d'update", () => {
    const document: Pick<DocumentJnews, 'guid' | 'signals'> = {
      guid: 'VGGVIO',
      signals: [
        { uri: 'http://cv.iptc.org/newscodes/signal/correction' },
        { uri: 'http://cv.iptc.org/newscodes/signal/cwarn' },
      ],
    }

    const documentExpected: Partial<DocumentJnews> = {
      guid: 'VGGVIO',
      signals: [
        { uri: 'http://cv.iptc.org/newscodes/signal/cwarn' },
        { uri: 'http://cv.iptc.org/newscodes/signal/update' },
      ],
    }

    expect(
      applySignal(
        document as DocumentJnews,
        'http://cv.iptc.org/newscodes/signal/update'
      )
    ).toStrictEqual(documentExpected)
  })
})
