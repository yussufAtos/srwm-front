export type Headline = Title | Subtitle | Catchline

export interface IHeadLine {
  value: string
}

export interface Title extends IHeadLine {
  role: HeadlineRole.LONG_TITLE | HeadlineRole.SHORT_TITLE
}

export interface Subtitle extends IHeadLine {
  role: HeadlineRole.SUBTITLE
  rank: number
}

export interface Catchline extends IHeadLine {
  role: HeadlineRole.CATCH_LINE
}

export const enum HeadlineRole {
  CATCH_LINE = 'http://cv.afp.com/headlineroles/catchline',
  SHORT_TITLE = 'http://cv.afp.com/headlineroles/shorttitle',
  LONG_TITLE = 'http://cv.afp.com/headlineroles/longtitle',
  SUBTITLE = 'http://cv.afp.com/headlineroles/subtitletitle',
}
