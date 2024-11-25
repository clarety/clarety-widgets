import React from 'react';
import { DonationPanel as BaseDonationPanel } from 'shared/components';

export class DonationPanel extends BaseDonationPanel {
  getDefaults(priceHandles) {
    const { donationInCart, donationOfferUid } = this.props;

    if (priceHandles && priceHandles.length && donationInCart) {
      const amount = donationInCart.price.toFixed(2);
      const amounts = priceHandles[0].amounts;
      const isVariableAmount = !amounts.find(amt => amt.amount === amount);

      return {
        frequency: 'single',
        selections: {
          single: {
            offerUid: donationOfferUid,
            offerPaymentUid:  null,
            amount: isVariableAmount ? null : amount,
            variableAmount: isVariableAmount ? amount : null,
            isVariableAmount: isVariableAmount,
          }
        },
      };
    }

    return super.getDefaults(priceHandles);
  }

  onClickNone = async (event) => {
    event.preventDefault();

    const { nextPanel, removeItemsWithType } = this.props;

    this.onChangeFrequency('single');
    this.onSelectAmount('single', 0, false);

    this.setState({ isBusyNone: true });
    await removeItemsWithType('donation');
    this.setState({ isBusyNone: false });

    nextPanel();
  };

  onClickNext = async (event) => {
    event.preventDefault();

    const { addToCart, nextPanel, layout, removeItemsWithType } = this.props;
    const { frequency, selections } = this.state;

    if (layout === 'page') return;

    this.setState({ isBusy: true });

    await removeItemsWithType('donation');

    const selection = selections[frequency];
    await addToCart({
      type:            'donation',
      offerUid:        selection.offerUid,
      offerPaymentUid: selection.offerPaymentUid,
      price:           selection.amount,
    });

    this.setState({ isBusy: false });

    nextPanel();
  };

  onPressEdit = (event) => {
    event.preventDefault();
    this.props.editPanel();
  }

  onEditPanel() {
    // override to prevent default behaviour of removing the donation on edit.
    // the behaviour we want is to keep any existing donation in the cart,
    // then remove it when moving to next panel, and add whatever option was selected.
  }
}
