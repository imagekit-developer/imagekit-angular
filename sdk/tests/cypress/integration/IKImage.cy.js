describe('ik-image component', () => {
  const APP_HOST = Cypress.env().APP_HOST;

  describe('Lazyload', () => {
    it('should have empty src before reaching lazyload threshold', () => {
      cy.visit(APP_HOST);

      cy.get('.lazyload').find('img').should('have.attr', 'src').and('equal', '');
    });

    it('should have actual src after reaching lazyload threshold', () => {
      cy.visit(APP_HOST);

      cy.get('.lazyload').find('img').scrollIntoView();

      cy.wait(500);

      cy.get('.lazyload')
        .find('img')
        .should('have.attr', 'src')
        .and('include', 'tr:h-200,w-200/default-image.jpg');
    });
  });

  describe('Lazyload with LQIP', () => {
    it('should have lqip src before reaching threshold', () => {
      cy.visit(APP_HOST);

      cy.get('.lazyload-lqip')
        .find('img')
        .should('have.attr', 'src')
        .and('include', 'tr:h-200,w-200:q-20,bl-30/default-image.jpg');
    });

    it('should have actual src after reaching element', () => {
      cy.visit(APP_HOST);

      cy.get('.lazyload-lqip').find('img').scrollIntoView();

      cy.wait(1000);

      cy.get('.lazyload-lqip')
        .find('img')
        .should('have.attr', 'src')
        .and('include', 'tr:h-200,w-200/default-image.jpg');
    });
  });

  describe('LQIP', () => {
    // unable to test this because actual image load always finishes too quickly
    it.skip('should have lqip src before image is loaded', () => {
      cy.visit(APP_HOST);

      cy.get('.lqip')
        .find('img')
        .should('have.attr', 'src')
        .and('include', 'tr:h-200,w-200:q-20,bl-10/default-image.jpg');
    });

    it('should have actual src after image is loaded', () => {
      cy.visit(APP_HOST);

      cy.get('.lqip').find('img').scrollIntoView();

      cy.wait(500);

      cy.get('.lqip')
        .find('img')
        .should('have.attr', 'src')
        .and('include', 'tr:h-200,w-200/default-image.jpg');
    });
  });

  describe('State update check', () => {
    it('should update image src with chained transformation outside IKContext dynamically', () => {
      cy.visit(APP_HOST);

      cy.get('.img-transformation-direct').find('img').scrollIntoView();

      cy.wait(500);

      cy.get('.img-transformation-direct')
        .find('img')
        .should('have.attr', 'src')
        .and('include', 'tr:h-300,w-300/default-image.jpg');

      cy.get('.btn-to-change-tr-direct').click();
      cy.get('.img-transformation-direct').find('img').scrollIntoView();
      cy.wait(500);

      cy.get('.img-transformation-direct')
        .find('img')
        .should('have.attr', 'src')
        .and('include', 'tr:h-200,w-600,r-max:h-200,w-200,rt-180:ot-TEST,oy-50,ox-100,otc-10C0F0/default-image.jpg');
    });
    it('should update image src within IKContext when button is clicked', () => {
      cy.visit(APP_HOST);

      cy.get('.img-transformation').find('img').scrollIntoView();

      cy.wait(500);

      cy.get('.img-transformation')
        .find('img')
        .should('have.attr', 'src')
        .and('include', 'tr:h-200,w-200/default-image.jpg');

      cy.get('.btn-to-change-tr').click();
      cy.get('.img-transformation').find('img').scrollIntoView();
      cy.wait(500);

      cy.get('.img-transformation')
        .find('img')
        .should('have.attr', 'src')
        .and('include', 'tr:h-200,w-200,r-max/default-image.jpg');
    });
  });
});
