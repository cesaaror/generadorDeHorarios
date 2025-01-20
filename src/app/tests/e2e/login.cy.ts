describe('Login Page', () => {
    it('should load the login page successfully', () => {
      // Visita la página de inicio de sesión
      cy.visit('/auth/login');
  
      // Verifica que el título o texto esperado esté visible
      cy.contains('Login').should('be.visible');
    });
  
    it('should allow form submission', () => {
      // Visita la página de inicio de sesión
      cy.visit('/auth/login');
  
      // Rellena el formulario
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
  
      // Haz clic en el botón de inicio de sesión
      cy.get('button[type="submit"]').click();
  
      // Verifica que redirige al dashboard
      cy.url().should('include', '/dashboard');
    });
  });
  