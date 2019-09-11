import { getAmountPanelSelection } from 'donate/selectors';

export class Validations {
  validateAmountPanel(errors, getState) {
    const state = getState();

    // Make sure an amount has been selected.
    const selection = getAmountPanelSelection(state);
    if (!selection.amount) {
      errors.push({
        message: 'Please select a donation amount.',
      });
    }

    return errors.length === 0;
  }

  validateEmail(email) {
    return /^.+@.+\..+$/.test(email);
  }
}
