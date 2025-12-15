describe('ik-image component', () => {
  const APP_HOST = Cypress.env().APP_HOST;

  beforeEach(() => {
    cy.visit(APP_HOST);
  });

  describe('Basic Image Rendering', () => {
    it('should render basic image with transformations', () => {
      cy.get('ik-image').first().find('img')
        .should('have.attr', 'src')
        .and('include', '/default-image.jpg')
        .and('include', 'tr=h-300,w-400');
    });

    it('should have proper alt attribute', () => {
      cy.get('ik-image').first().find('img')
        .should('have.attr', 'alt')
        .and('equal', 'Basic image');
    });
  });

  describe('Responsive Images', () => {
    it('should generate srcset for responsive images', () => {
      cy.get('ik-image').eq(1).find('img')
        .should('have.attr', 'srcset')
        .and('not.be.empty');
    });

    it('should have responsive transformation in src', () => {
      cy.get('ik-image').eq(1).find('img')
        .should('have.attr', 'src')
        .and('include', '?tr=');
    });
  });

  describe('Chained Transformations', () => {
    it('should apply multiple transformations correctly', () => {
      cy.get('ik-image').eq(2).find('img')
        .should('have.attr', 'src')
        .and('include', 'h-300,w-300')
        .and('include', 'rt-90');
    });

    it('should convert to webp format', () => {
      cy.get('ik-image').eq(2).find('img')
        .should('have.attr', 'src')
        .and('include', 'f-webp');
    });
  });

  describe('External URL', () => {
    it('should handle external image URLs', () => {
      cy.get('ik-image').eq(3).find('img')
        .should('have.attr', 'src')
        .and('include', 'placehold.co');
    });
  });

  describe('Lazy Loading', () => {
    it('should have loading attribute set to lazy', () => {
      cy.get('ik-image').eq(4).find('img')
        .should('have.attr', 'loading')
        .and('equal', 'lazy');
    });

    it('should load image with transformations when scrolled into view', () => {
      cy.get('ik-image').eq(4).scrollIntoView();
      cy.wait(500);
      
      cy.get('ik-image').eq(4).find('img')
        .should('have.attr', 'src')
        .and('include', '/default-image.jpg')
        .and('include', 'tr=h-500,w-500');
    });
  });

  describe('Image Loading', () => {
    it('should successfully load and display images', () => {
      cy.get('ik-image').first().find('img')
        .should('be.visible')
        .and(($img) => {
          expect($img[0].naturalWidth).to.be.greaterThan(0);
        });
    });
  });
});
