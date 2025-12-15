describe('ik-video component', () => {
  const APP_HOST = Cypress.env().APP_HOST;

  beforeEach(() => {
    cy.visit(APP_HOST);
  });

  describe('Video Rendering', () => {
    it('should render video with transformations', () => {
      cy.get('ik-video').find('video')
        .should('have.attr', 'src')
        .and('include', '/sample-video.mp4')
        .and('include', 'tr=h-400,w-600');
    });

    it('should have video controls and attributes', () => {
      cy.get('ik-video').find('video').then($video => {
        expect($video).to.have.attr('autoplay');
        expect($video).to.have.attr('loop');
        expect($video).to.have.attr('muted');
      });
    });

    it('should apply quality transformation', () => {
      cy.get('ik-video').find('video')
        .should('have.attr', 'src')
        .and('include', 'q-80');
    });

    it('should be visible on the page', () => {
      cy.get('ik-video').find('video')
        .should('be.visible');
    });
  });

  describe('Video Element Properties', () => {
    it('should have valid video source URL', () => {
      cy.get('ik-video').find('video')
        .should('have.attr', 'src')
        .and('match', /^https?:\/\//);
    });

    it('should be in the viewport when scrolled to', () => {
      cy.get('ik-video').scrollIntoView();
      cy.wait(500);
      
      cy.get('ik-video').find('video')
        .should('be.visible');
    });
  });
});
