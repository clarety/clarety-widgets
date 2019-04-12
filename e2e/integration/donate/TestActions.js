/* eslint-disable no-unused-expressions */

export class TestActions {
  launch() {
    // TODO: setup url http://localhost:3000/donate-widget
    cy.visit('http://localhost:3000/');
  }

  clickNext() {
    cy.testId('next-button').click();
  }

  clickDonate() {
    cy.testId('donate-button').click();
  }

  fillAmountPanel(config, data) {
    cy.testId('amount-panel');
    this.setFrequency(config.frequency);
    this.selectAmount(config.isVariable, data);
  }

  setFrequency(frequency) {
    cy.testId(frequency).click();
  }

  selectAmount(isVariable, data) {
    if (isVariable) {
      cy.testId('variable-amount-input').type(data.variableAmount);
    } else {
      cy.testId(`amount-${data.amount}`).click();
    }
  }

  fillDetailsPanel(config, data) {
    cy.testId('details-panel');
    cy.testId('first-name-input').type(data.firstName);
    cy.testId('last-name-input').type(data.lastName);
    cy.testId('email-input').type(data.email);
  }

  fillPaymentPanel(config, data) {
    cy.testId('payment-panel');
    cy.testId('card-number-input').type(data.cardNumber);
    cy.testId('expiry-input').type(data.cardExpiry);
    cy.testId('ccv-input').type(data.ccv);
  }

  expectAmountInStore(config, data) {
    const amount = config.isVariable ? data.variableAmount : data.amount;

    cy.window()
      .its('store')
      .then(store => {
        const saleLines = store.getState().sale.saleLines;
        expect(saleLines).to.have.lengthOf(1);
        expect(saleLines[0].amount).to.equal(amount);
      });
  }

  expectSuccess(config, data) {
    const expectedAmount = config.isVariable ? data.variableAmount : data.amount;

    cy.testId('result-email').should('contain', data.email);
    cy.testId('result-amount').should('contain', expectedAmount);
    cy.testId('result-last4').should('contain', data.cardNumber.substring(0, 4));
  }
}
