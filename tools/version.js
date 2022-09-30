const { gitDescribeSync } = require('git-describe')
const { resolve, relative } = require('path')
const { writeFileSync } = require('fs-extra')
const { readFileSync } = require('fs')
const { argv } = require('process')

if (process.argv.length < 2) {
  throw new Error('application name missing')
}

const fileVersion = JSON.parse(
  readFileSync(
    resolve(__dirname, '..', 'apps', argv[2], 'VERSION.json'),
    'utf-8'
  )
)

const gitInfos = gitDescribeSync({
  dirtyMark: false,
  dirtySemver: false,
})

gitInfos.version = fileVersion.version

const file = resolve(
  __dirname,
  '..',
  'apps',
  argv[2],
  'src',
  'environments',
  'version.ts'
)
writeFileSync(
  file,
  `// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
/* tslint:disable */
export const VERSION = ${JSON.stringify(gitInfos, null, 4)};
/* tslint:enable */
`,
  { encoding: 'utf-8' }
)

console.log(
  `Wrote version info ${gitInfos.raw} to ${relative(
    resolve(__dirname, '..'),
    file
  )}`
)
