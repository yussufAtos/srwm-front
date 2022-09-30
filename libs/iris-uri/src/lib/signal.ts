/**
 * @see http://cv.iptc.org/newscodes/signal
 */

export interface Signal {
  uri: SignalType
}

export type SignalType =
  | 'http://cv.iptc.org/newscodes/signal/correction'
  | 'http://cv.iptc.org/newscodes/signal/cwarn'
  | 'http://cv.iptc.org/newscodes/signal/update'

type HumanSignal = 'correction' | 'update'
export function humanSignals(signals: Signal[]) {
  const signalsString: HumanSignal[] = []
  for (const signal of signals) {
    switch (signal.uri) {
      case 'http://cv.iptc.org/newscodes/signal/correction': {
        signalsString.push('correction')
        break
      }
      case 'http://cv.iptc.org/newscodes/signal/update': {
        signalsString.push('update')
        break
      }
    }
  }
  return signalsString
}
