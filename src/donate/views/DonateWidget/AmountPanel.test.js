import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, fireEvent, cleanup } from 'react-testing-library';

import mockExplainResponse from '../../mock-data/explain.json';

import donateReducer from '../../reducers/donate-reducer';
import { selectDefaults } from '../../actions';
import { setExplain, setStatus, statuses } from '../../../shared/actions';

import AmountPanel from './AmountPanel';


const historyMock = { push: jest.fn() };

const renderComponent = () => {
  const explain = mockExplainResponse.result[0];

  const store = createStore(donateReducer);
  store.dispatch(setStatus(statuses.ready));
  store.dispatch(setExplain(explain));
  store.dispatch(selectDefaults(explain.donationOffers));

  const result = render(
    <Provider store={store}>
      <AmountPanel history={historyMock} />
    </Provider>
  );

  return {
    ...result,
    store,
  };
};


describe('<AmountPanel>', () => {
  afterEach(cleanup);

  it('renders without crashing', () => {
    const { getByTestId } = renderComponent();
    getByTestId('suggested-amounts');
  });

  it('displays prices correctly', () => {
    const { getByText } = renderComponent();
    getByText('AUD $30');
    getByText('AUD $60');
    getByText('AUD $100');
  });

  it('automatically selects default amounts', () => {
    const { getByTestId, getByLabelText } = renderComponent();

    const singleAmounts = getByTestId('suggested-amounts');
    expect(singleAmounts.children.length).toBe(4);
    expect(singleAmounts.children[0].className).not.toContain('bg-primary text-white');
    expect(singleAmounts.children[1].className).not.toContain('bg-primary text-white');
    expect(singleAmounts.children[2].className).toContain('bg-primary text-white');
    expect(singleAmounts.children[3].className).not.toContain('bg-primary text-white');

    fireEvent.click(getByLabelText('Monthly'));

    const recurringAmounts = getByTestId('suggested-amounts');
    expect(recurringAmounts.children.length).toBe(3);
    expect(recurringAmounts.children[0].className).not.toContain('bg-primary text-white');
    expect(recurringAmounts.children[1].className).toContain('bg-primary text-white');
    expect(recurringAmounts.children[2].className).not.toContain('bg-primary text-white');
  });

  it('persists selections when switching between frequencies', () => {
    const { getByTestId, getByLabelText } = renderComponent();

    // Select a single amount.
    let singleAmounts = getByTestId('suggested-amounts');
    fireEvent.click(singleAmounts.children[1]);
    
    // Select a monthly amount.
    fireEvent.click(getByLabelText('Monthly'));
    const recurringAmounts = getByTestId('suggested-amounts');
    fireEvent.click(recurringAmounts.children[0]);

    // Return to single amounts, original selection should persist.
    fireEvent.click(getByLabelText('One-Time'));
    singleAmounts = getByTestId('suggested-amounts');
    expect(singleAmounts.children[0].className).not.toContain('bg-primary text-white');
    expect(singleAmounts.children[1].className).toContain('bg-primary text-white');
    expect(singleAmounts.children[2].className).not.toContain('bg-primary text-white');
    expect(singleAmounts.children[3].className).not.toContain('bg-primary text-white');
  });

  it('requires a selected donation amount', () => {
    const { getByLabelText, getByText, queryByText } = renderComponent();

    fireEvent.click(getByLabelText('Yearly'));
    fireEvent.click(getByText('Next'));

    expect(queryByText('Please select a donation amount.')).not.toBeNull();
    expect(queryByText('Choose Amount')).not.toBeNull();
    expect(queryByText('Personal Details')).toBeNull();
  });

  it('requires a donation amount when variable input is selected', () => {
    const { getByTestId, getByText, queryByText } = renderComponent();

    let singleAmounts = getByTestId('suggested-amounts');
    fireEvent.click(singleAmounts.children[3]);
    fireEvent.click(getByText('Next'));

    expect(queryByText('Choose Amount')).not.toBeNull();
    expect(queryByText('Personal Details')).toBeNull();
  });

  it('can select a suggested amount', () => {
    const { getByTestId, getByText, store } = renderComponent();

    let singleAmounts = getByTestId('suggested-amounts');
    fireEvent.click(singleAmounts.children[0]);
    fireEvent.click(getByText('Next'));

    expect(store.getState().sale.saleLines[0].amount).toBe(30);
    expect(historyMock.push).toBeCalledWith('/details');
  });

  it('can enter a variable amount', () => {
    const { getByTestId, getByText, store } = renderComponent();

    const input = getByTestId('variable-amount-input');
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.click(getByText('Next'));

    expect(store.getState().sale.saleLines[0].amount).toBe(123);
    expect(historyMock.push).toBeCalledWith('/details');
  });
});
