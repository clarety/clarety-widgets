export class TestActions {

  launch() {
    // TODO: fixed donate widget url.
    cy.visit('http://localhost:3000/');
  }

  nextPanel() {
    cy.testId('next-button').click();
  }

  fillAmountPanel(config, data) {
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

  expectAmountInStore(config, data) {
    const amount = config.isVariable ? data.variableAmount : data.amount;

    cy.window()
      .its('store')
      .then(store => {
        const saleLine = store.getState().sale.saleLines[0];
        expect(saleLine.amount).to.equal(amount);
        // assert.equal(saleLine.amount, amount);
      });
  }

  expectAmountPanel() {
    cy.testId('amount-panel');
  }

  expectDetailsPanel() {
    cy.testId('details-panel');
  }
}
