/**
 * @see https://cv.iptc.org/newscodes/pubstatusg2
 */

export type PublicationStatus =
  | 'http://cv.iptc.org/newscodes/pubstatusg2/usable'
  | 'http://cv.iptc.org/newscodes/pubstatusg2/canceled'
  | 'http://cv.iptc.org/newscodes/pubstatusg2/withheld'

export function humanPubStatus(pubStatus: PublicationStatus) {
  if (pubStatus === 'http://cv.iptc.org/newscodes/pubstatusg2/usable') {
    return 'USABLE'
  } else if (
    pubStatus === 'http://cv.iptc.org/newscodes/pubstatusg2/canceled'
  ) {
    return 'CANCELED'
  } else if (
    pubStatus === 'http://cv.iptc.org/newscodes/pubstatusg2/withheld'
  ) {
    return 'WITHHELD'
  }
  return 'UNKNOW'
}
