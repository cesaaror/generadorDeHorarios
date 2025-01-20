describe('Dashboard Flow', () => {
    it('logs in and navigates to the dashboard', () => {
      cy.visit('/auth/login');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
  
      cy.url().should('include', '/dashboard');
      cy.contains('Total Users').should('exist');
      cy.contains('Paginated Data').should('exist');
    });
  });
  