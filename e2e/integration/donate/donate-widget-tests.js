export const donateTestData = {
  url: 'http://localhost:3000/e2e/donate-widget.html',

  amount: 30,
  variableAmount: 12.34,

  firstName: 'George',
  lastName: 'Costanza',
  email: 'gc@humanfund.org',

  cardNumber: '4242424242424242',
  cardExpiry: '12/34',
  ccv: '123',
};

export const donateWidgetTests = (TestActions, config, data) => {

  const act = new TestActions();

  describe(`Donate Widget: ${config.testName}`, () => {

    it('Successfully makes a donation', () => {
      act.launch(config, data);

      act.fillAmountPanel(config, data);
      act.clickNext();

      act.expectAmountInStore(config, data);

      act.fillDetailsPanel(config, data);
      act.clickNext();

      act.fillPaymentPanel(config, data);
      act.clickDonate();

      act.expectSuccess(config, data);
    });

  });
};
