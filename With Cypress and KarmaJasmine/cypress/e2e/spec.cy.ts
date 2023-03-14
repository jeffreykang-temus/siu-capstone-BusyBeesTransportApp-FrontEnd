import * as cypress from "cypress"

describe('Registration Form Submission', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/register');
  });

  // Test Case #1 - Passed
  it('Register form submission successfully if email does not exist', () => {
    // Fill in registration form fields
    cy.get('#firstName').type('Cypress');
    cy.get('#lastName').type('Tan');
    cy.get('#email').type('CypressTan8@gmail.com');  // This email does not exist in the database currently
    cy.get('#password').type('password');
    cy.get('#dateOfBirth').type('1990-01-01');

    // Click the Register button and wait for the page to load
    cy.get('.btn.btn-dark')
      .scrollIntoView()
      .click({ force: true })
      .wait(6000);

    // Assert that the URL contains the expected path after successful registration
    cy.url().should('include', '/login');

    // Assert that a success message is displayed on the page
    cy.contains('Account registered successfully').should('be.visible');
  });

  // Test Case #2 - Passed
  it('Register form submission unsuccessful if email already exists', () => {
    // Fill in registration form fields
    cy.get('#firstName').type('Chris');
    cy.get('#lastName').type('Tan');
    cy.get('#email').type('chris@gmail.com');   // This email already exists in the database
    cy.get('#password').type('12345678');
    cy.get('#dateOfBirth').type('1990-01-01');

    // Click the Register button and wait for the page to load
    cy.get('.btn.btn-dark')
      .scrollIntoView()
      .click({ force: true })
      .wait(6000);

    // Assert that the URL does not contain the expected path after unsuccessful registration
    cy.url().should('not.include', '/login');

    // Assert that an unsuccessful message is displayed on the page
    cy.contains('Email already exists').should('be.visible');
  });
});


describe('Verify Email', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/verify-email');
  });

  // Test Case #3 - Passed
  it('Verify email should succeed if correct token is entered', () => {
    // Fill in form fields and click on the button
    cy.get('form').should('be.visible');
    cy.wait(1000);
    cy.get('#verificationCode').type('BD2644091A7330BA19E8F2137FF4FADD681EA803A254E90673E55C07CC15727E6269D34C2E6E2A1364781D64B3847159F43E927E8F5E727AA08553AD6D309E7C'); // A valid verification token should be entered here
    cy.get('button').contains('Submit').should('be.visible').click();
    cy.wait(8000);

    // Assert that a success message is displayed on the page
    cy.contains('Account verified successfully').should('be.visible');

    // Assert that the URL contains the expected path after successful verification
    cy.url().should('include', '/login')
  });

  // Test Case #4 - Passed  
  it('Verify email should fail if wrong token is entered', () => {
    // Fill in the form fields and click on the button
    cy.get('form').should('be.visible');
    cy.wait(1000);
    cy.get('#verificationCode').type('thisIsAnInvalidToken');
    cy.get('button').contains('Submit').should('be.visible').click();
    cy.wait(6000);

    // Assert that an unsuccessful message is displayed on the page
    cy.contains('Token is invalid!').should('be.visible');

    // Assert that the URL does not contain the expected path after unsuccessful verification
    cy.url().should('not.include', '/login')
  });
});


describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
  });

  // Test Case #5 - Passed
  it('Login successful with correct user login credential', () => {
    // Fill in form fields and click on the button
    cy.get('form').should('be.visible');
    cy.wait(1000);
    cy.get('#email').type('chris@gmail.com');
    cy.get('#password').type('12345678');
    cy.get('button').contains('Login').should('be.visible').click();
    cy.wait(6000);

    // Assert that the URL contains the expected path after successful login
    cy.url().should('include', '/profile');

    // Assert that a success message is displayed on the page
    cy.contains('Welcome back').should('be.visible');
  });

  // Test Case #6 - Passed
  it('Login unsuccessful with invalid user login credential', () => {
    // Fill in form fields and click on the button
    cy.get('form').should('be.visible');
    cy.wait(1000);
    cy.get('#email').type('Chris@gmail.com');
    cy.get('#password').type('invalidpassword');
    cy.get('button').contains('Login').should('be.visible').click();
    cy.wait(8000);

    // Assert that the URL does not contain the expected path after unsuccessful login
    cy.url().should('not.include', '/profile');

    // Assert that an error message is displayed on the page
    cy.contains('Wrong password').should('be.visible');
  });
})





  describe('Forgot password request submission', () => {
    beforeEach(() => {
      cy.visit('http://localhost:4200/forgot-password');
    });

    // Test Case #7 - Passed
    it('Forgot password request should succeed if valid email is ', () => {
      // Fill in the form fields and click on the button
      cy.get('form').should('be.visible');
      cy.wait(1000);
      cy.get('[formControlName="forgotPasswordEmail"]').type('chris@gmail.com');
      cy.get('button').contains('Send').should('be.visible').click();
      cy.wait(10000);

      // Assert that the URL contains the expected path once successful
      cy.url().should('include', '/forgot-password-sent')

      // Assert that a success message is displayed on the page
      cy.contains('Sent').should('be.visible');
    });

    // Test Case #8 - Passed
    it('Verify email should fail if wrong token is entered', () => {
      // Fill in the form fields and click on the button
      cy.get('form').should('be.visible');
      cy.wait(1000);
      cy.get('[formControlName="forgotPasswordEmail"]').type('invalidEmail@gmail.com');
      cy.get('button').contains('Send').should('be.visible').click();
      cy.wait(6000);

      // Assert that the URL does not contain the expected path if unsuccessful
      cy.url().should('not.include', '/forgot-password-sent')

      // Assert that an unsuccessful message is displayed on the page
      cy.contains('does not exist').should('be.visible');
    });
  })


  describe('Change Password Submission', () => {
    beforeEach(() => {
      cy.visit('http://localhost:4200/forgot-password-change');
    });

    // Test Case #9 - Passed
    it('Reset password should succeed if valid token is entered', () => {
      // Fill in the form fields and click on the button
      cy.get('form').should('be.visible');
      cy.wait(1000);
      cy.get('[formControlName="token"]').type('1580329FB2B251D0FDEACCBFC2B8E636B45B59C72875BDBBCA8BB62DA9E0B4B5734E557CBE9D5C192F96C5524ED02F2FAC7179952B7F29D43C84D92E721CC03B'); // Need to enter the one-time-use reset token
      cy.get('[formControlName="password"]').type('12345678')
      cy.get('[formControlName="confirmPassword"]').type('12345678')
      cy.get('button').contains('Reset password').should('be.visible').click();
      cy.wait(10000);

      // Assert that the URL contains the expected path once successful
      cy.url().should('include', '/login')

      // Assert that a success message is displayed on the page
      cy.contains('Password reset successfully').should('be.visible');
    });

    // Test Case #10 - Passed
    it('Reset password should fail if reset token is invalid', () => {
      // Fill in the form fields and click on the button
      cy.get('form').should('be.visible');
      cy.wait(1000);
      cy.get('[formControlName="token"]').type('thisIsAnInvalidResetToken');
      cy.get('[formControlName="password"]').type('12345678')
      cy.get('[formControlName="confirmPassword"]').type('12345678')
      cy.get('button').contains('Reset password').should('be.visible').click();
      cy.wait(10000);

      // Assert that a success message is displayed on the page
      cy.contains('Token is invalid!').should('be.visible');

      // Assert that the URL does not containf the expected path if unsuccessful
      cy.url().should('not.include', '/login')
    });
  })