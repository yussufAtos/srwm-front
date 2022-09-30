beforeEach(() => {
  cy.intercept(
    {
      method: 'GET',
      url: '/dev/documents/?guid=http://d.afp.com/3FQ3YM',
    },
    { fixture: 'webstory.json' }
  ).as('getWebstory')

  cy.intercept(
    {
      method: 'GET',
      url: '/dev/documents',
      query: { guid: '**' },
    },
    { fixture: 'webstory.json' }
  ).as('getWebstory2')

  cy.intercept('POST', '/dev/amps', {
    fixture: 'upload-zip.json',
    statusCode: 200,
    delay: 500,
  }).as('putZipUpload')

  cy.intercept(
    {
      method: 'GET',
      url: '/dev/documents/?guid=http://iamconnected.com',
    },
    {
      body: `{"timestamp":"2022-07-04T15:05:47.888+00:00","status":404,"error":"Not Found","message":"Unexpected search result received from CMS: document is not found","path":"/documents/"}`,
    }
  ).as('imConnected')
})
