import { DonateTestActions } from './donate-test-actions';
import { donateWidgetTests, donateTestData } from './donate-widget-tests';

class InstanceTestActions extends DonateTestActions {
  clickNext() {
    cy.log('click next from instance!');
    super.clickNext();
  }
}

const config1 = {
  testName: 'One-off donation of suggested amount',
  frequency: 'single',
  isVariable: false,
};
donateWidgetTests(InstanceTestActions, config1, donateTestData);

const config2 = {
  testName: 'One-off donation of variable amount',
  frequency: 'single',
  isVariable: true,
};
donateWidgetTests(InstanceTestActions, config2, donateTestData);

// TODO: setup mock data that has 'recurring' instead of 'monthly'.

const config3 = {
  testName: 'Monthly donation of suggested amount',
  frequency: 'monthly',
  isVariable: false,
};
donateWidgetTests(InstanceTestActions, config3, donateTestData);

const config4 = {
  testName: 'Monthly donation of variable amount',
  frequency: 'monthly',
  isVariable: true,
};
donateWidgetTests(InstanceTestActions, config4, donateTestData);
