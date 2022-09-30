import { DocumentJnews } from '../jnews'
import { SignalType } from '../signal'
import { AfpSubject, MediaTopicSubject } from '../subject'

/**
 * Ajoute le signal au document. C'est impossible d'avoir deux signals.
 * Ajouter un signal de correction à un document ayant un signal d'update provoque la suppression du signal d'update, et vice-versa.
 * @param document document
 * @param signalType signal to apply
 * @returns le document modifié
 */
export function applySignal(
  document: DocumentJnews,
  signalType: SignalType
): DocumentJnews {
  if (!document.signals) {
    document.signals = []
  }

  if (signalType === 'http://cv.iptc.org/newscodes/signal/update') {
    // On ne peut pas avoir à la fois un signal d'update et de correction
    document.signals = document.signals.filter(
      (e) => e.uri !== 'http://cv.iptc.org/newscodes/signal/correction'
    )
  } else if (signalType === 'http://cv.iptc.org/newscodes/signal/correction') {
    document.signals = document.signals.filter(
      (e) => e.uri !== 'http://cv.iptc.org/newscodes/signal/update'
    )
  }
  if (
    !document.signals.find((currentSignal) => currentSignal.uri === signalType)
  ) {
    document.signals.push({ uri: signalType })
  }

  return document
}

export function dispatchSubject(subjects?: AfpSubject[]): {
  mediatopics: MediaTopicSubject[]
} {
  const mediatopics: MediaTopicSubject[] = []

  if (subjects) {
    for (const subject of subjects) {
      // TODO on doit normalement faire le test si dans l'uri il y a mediatopics...
      if (subject.type === 'http://cv.iptc.org/newscodes/cpnature/abstract') {
        mediatopics.push(subject)
      }
    }
  }
  return { mediatopics }
}
