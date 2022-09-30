/**
 * @see https://cv.iptc.org/newscodes/cpnature
 */

export type AfpSubject =
  | MediaTopicSubject
  | EventSubject
  | PersonSubject
  | LocationSubject

export type SubjectNature =
  | 'http://cv.iptc.org/newscodes/cpnature/event'
  | 'http://cv.iptc.org/newscodes/cpnature/person'
  | 'http://cv.iptc.org/newscodes/cpnature/organisation'
  | 'http://cv.iptc.org/newscodes/cpnature/abstract'
  | 'http://cv.iptc.org/newscodes/cpnature/geoArea'
  | 'http://cv.iptc.org/newscodes/cpnature/poi'

export interface ISubject {
  uri: string
}

export interface MediaTopicSubject extends ISubject {
  type: 'http://cv.iptc.org/newscodes/cpnature/abstract'
  name?: string
}

export interface PersonSubject extends ISubject {
  type: 'http://cv.iptc.org/newscodes/cpnature/person'
  givenName: string
  familyName: string
}

export interface EventSubject extends ISubject {
  type: 'http://cv.iptc.org/newscodes/cpnature/event'
  name?: string
}

export interface LocationSubject extends ISubject {
  type: 'http://cv.iptc.org/newscodes/cpnature/geoArea'
  uri: string
  name: string
}
