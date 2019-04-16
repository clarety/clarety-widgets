import { DonateTestActions } from './donate-test-actions';
import { donateWidgetTests, donateTestData } from './donate-widget-tests';

donateWidgetTests(DonateTestActions, donateTestData, {
  testName: 'One-off donation of suggested amount',
  frequency: 'single',
  isVariable: false,
});

donateWidgetTests(DonateTestActions, donateTestData, {
  testName: 'One-off donation of variable amount',
  frequency: 'single',
  isVariable: true,
});

donateWidgetTests(DonateTestActions, donateTestData, {
  testName: 'Monthly donation of suggested amount',
  frequency: 'monthly',
  isVariable: false,
});

donateWidgetTests(DonateTestActions, donateTestData, {
  testName: 'Monthly donation of variable amount',
  frequency: 'monthly',
  isVariable: true,
});
