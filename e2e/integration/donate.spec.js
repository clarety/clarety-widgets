import { TestActions } from './donate/TestActions';
import { donateWidgetTests, testData } from './donate/donateWidgetTests';

class InstanceTestActions extends TestActions {
  clickNext() {
    cy.log('hello from instance!');
    super.clickNext();
  }
}

testData.variableAmount = 987;

// TODO: setup mock data that has 'recurring' instead of 'monthly'.
const config = {
  testName: 'Monthly donation of variable amount',
  frequency: 'monthly',
  isVariable: true,
};

donateWidgetTests(InstanceTestActions, config, testData);
