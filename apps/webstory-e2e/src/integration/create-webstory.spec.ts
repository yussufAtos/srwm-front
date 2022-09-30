describe("Création d'une webstory", () => {
  function prepare(): void {
    cy.findByLabelText(/Choose AMP/i)
      .attachFile('balkany.zip')
      .as('uploadZip')

    cy.findByRole('button', { name: /Validate/i }).as('buttonValidate')

    cy.findByRole('textbox', { name: /headline/i }).as('headline')

    cy.findByRole('textbox', { name: /catchline/i }).as('editCatchline')

    cy.findByRole('textbox', { name: /editorial note/i }).as('edNote')

    cy.findByRole('textbox', { name: /language/i }).as('language')
  }
  it("La barre de progression doit exister puis disparaitre lors de l'upload du fichier AMP", () => {
    cy.visit('/editor/create')

    prepare()
    cy.findByRole('progressbar').should('not.exist')
    cy.get('@uploadZip')
    cy.findByRole('progressbar').should('exist')
    cy.wait('@putZipUpload')
    cy.findByRole('progressbar').should('not.exist')
  })

  it('doit afficher le titre et la langue contenue dans le fichier AMP', () => {
    cy.visit('/editor/create')

    prepare()

    cy.get('@uploadZip')
    cy.wait('@putZipUpload')
    cy.get('@headline').should(
      'have.value',
      'Nouvelles grèves dans les aéroports français'
    )
    cy.get('@language').should('have.value', 'fr')
    cy.get('@buttonValidate').should('be.enabled')
  })

  it('on fait un upload complet de bout en bout', () => {
    cy.visit('/editor/create')
    prepare()
    cy.intercept(
      {
        method: 'POST',
        url: '/dev/documents',
      },
      {
        delay: 500,
        body: {
          guid: 'http://d.afp.com/3FQ97L',
          version: 1,
          era: 2,
          metadataLanguage: 'fr',
          itemClass: 'http://cv.afp.com/itemnatures/webStory',
          provider: {
            uri: 'http://cv.iptc.org/newscodes/newsprovider/AFP',
            name: 'AFP',
          },
          versionCreated: '2022-07-04T16:06:36Z',
          firstCreated: '2022-07-04T16:06:36Z',
          pubStatus: 'http://cv.iptc.org/newscodes/pubstatusg2/usable',
          generators: [
            {
              name: 'libg2',
              versionInfo: 'libg2 3.10.0',
              role: 'http://cv.afp.com/generatorrole/libg2',
            },
          ],
          edNote: "ne pas fournir l'information à la SNCF",
          icons: [
            {
              rendition: 'http://cv.iptc.org/newscodes/rendition/preview',
              href: 'http://vspar-iris-d-wsback-31.afp.com:8585/components/57d99fdd07ff8d2f0a1e79826c78260dbdb083a2',
              contentType: 'image/jpeg',
            },
          ],
          urgency: 4,
          contentLanguage: 'fr',
          headline: 'Nouvelles grèves dans les aéroports français',
          catchline: 'Grève des aéroports, ce 6 juillet',
          remoteContents: [
            {
              href: 'http://vspar-iris-d-wsback-31.afp.com:8585/components/f2e30a752042868a044bdea5918ee0fc5a86dde1',
              contentType: 'application/zip',
            },
          ],
        },
      }
    )
    cy.get('@buttonValidate').should('be.disabled')

    cy.get('@uploadZip')
    cy.wait('@putZipUpload')

    cy.get('@editCatchline').type('Grève des aéroports, ce 6 juillet')

    cy.get('@edNote').type("ne pas donner l'information à la SNCF")

    cy.get('@buttonValidate').should('not.be.disabled')
    cy.get('@buttonValidate').click()
    cy.get('@buttonValidate').should('be.disabled')
  })
})
