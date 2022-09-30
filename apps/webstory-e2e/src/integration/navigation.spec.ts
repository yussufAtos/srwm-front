describe('Navigation dans le menu webstory', () => {
  let mockNavigation: { guid: string; encodedGuid: string }

  beforeEach(() => {
    // todo add login

    cy.visit('/')

    cy.findByRole('button', { name: /Validate/i }).as('buttonCreate')

    cy.findByRole('button', { name: /Update/i }).as('buttonEdit')
    cy.findByRole('button', { name: /Correct/i }).as('buttonCorrection')

    cy.findByRole('button', { name: /Kill/i }).as('buttonKill')

    cy.findByLabelText(/guid/i).as('inputGuid')

    const guid = 'http://d.afp.com/3FQ3YM'
    mockNavigation = {
      guid,
      encodedGuid: 'http:%2F%2Fd.afp.com%2F3FQ3YM',
    }
  })

  it('on doit juste pouvoir crééer une nouvelle webstory par défaut', () => {
    cy.get('@buttonCreate').should('be.enabled')
    cy.get('@buttonEdit').should('not.be.enabled')
    cy.get('@buttonCorrection').should('not.be.enabled')
  })

  it("quand on clique sur le bouton create, on doit aller sur l'éditeur de création de webstory", () => {
    cy.get('@buttonCreate').click()
    cy.url().should('include', '/editor/create')
  })

  describe("Les boutons nécessitant d'avoir un GUID rempli", () => {
    beforeEach(() => {
      const { guid } = mockNavigation
      cy.get('@inputGuid').type(guid)
    })

    it("quand on remplit un GUID, les boutons d'édition et de correction sont autorisés", () => {
      cy.get('@buttonCreate').should('be.enabled')
      cy.get('@buttonEdit').should('be.enabled')
      cy.get('@buttonCorrection').should('be.enabled')
      cy.get('@buttonKill').should('be.enabled')
    })

    it("quand on clique sur le bouton d'édition, on doit aller sur la page du formulaire d'édition", () => {
      const { encodedGuid } = mockNavigation
      cy.get('@buttonEdit').click()
      cy.url().should('include', `/editor/${encodedGuid}/edit`)
    })

    it('quand on clique sur le bouton de correction, on doit aller sur la page du formulaire de correction', () => {
      const { encodedGuid } = mockNavigation
      cy.get('@buttonCorrection').click()
      cy.url().should('include', `/editor/${encodedGuid}/correction`)
    })

    it('quand on clique sur le bouton de kill, on doit aller sur la page du formulaire de kill', () => {
      const { encodedGuid } = mockNavigation
      cy.get('@buttonKill').click()
      cy.url().should('include', `/editor/${encodedGuid}/kill`)
    })

    it.skip("doit renvoyer sur une page 404 not found si le document n'a pas été trouvé", () => {
      /* TODO document why this arrow function is empty */
    })
  })
})
