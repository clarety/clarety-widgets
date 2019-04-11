export const testData = {
  amount: 20,
  variableAmount: 123,
};

export const donateWidgetTests = (TestActions, config, data) => {

  const act = new TestActions();

  describe(`Donate Widget: ${config.testName}`, () => {

    it(config.testName, () => {
      act.launch();

      act.fillAmountPanel(config, data);
      act.nextPanel();
      act.expectAmountInStore(config, data);

      // TEMP:
      act.expectDetailsPanel();


      // act.fillDetailsPanel(config, data);
      // act.nextPanel();

      // act.paymentPanel(config, data);
      // act.nextPanel();

      // act.expect({
      //   amount: 40,
      //   frequency: 'single',
      //   customer: {
      //     firstName: 'George',
      //   }
      // });
    });  
  });
};
