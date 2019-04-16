import { DonateTestActions } from './donate-test-actions';
import { donateWidgetTests, donateTestData } from './donate-widget-tests';

class InstanceTestActions extends DonateTestActions {
  clickNext() {
    cy.log('click next from instance!');
    super.clickNext();
  }
}

donateWidgetTests(InstanceTestActions, donateTestData, {
  testName: 'One-off donation of suggested amount',
  frequency: 'single',
  isVariable: false,
});

donateWidgetTests(InstanceTestActions, donateTestData, {
  testName: 'One-off donation of variable amount',
  frequency: 'single',
  isVariable: true,
});

donateWidgetTests(InstanceTestActions, donateTestData, {
  testName: 'Monthly donation of suggested amount',
  frequency: 'monthly',
  isVariable: false,
});

donateWidgetTests(InstanceTestActions, donateTestData, {
  testName: 'Monthly donation of variable amount',
  frequency: 'monthly',
  isVariable: true,
});
