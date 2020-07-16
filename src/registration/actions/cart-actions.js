import { addItem, updateItem, removeItem } from 'shared/actions';
import { getCart } from 'shared/selectors';
import { getMerchOffer } from 'registration/selectors';
import { types } from 'registration/actions/types';

export const setFundraising = ({ goal, createPage }) => ({
  type: types.setFundraising,
  goal: goal,
  createPage: createPage,
});

export const setWaveInCart = (participantIndex, waveProductId) => {
  return async (dispatch, getState) => {
    const state = getState();
    const cart = getCart(state);

    const index = cart.items.findIndex(item =>
      item.type === 'event' &&
      item.options.participantIndex === participantIndex
    );

    dispatch(updateItem(index, {
      productId: waveProductId,
    }));
  };
};

export const addAddOnToCart = (item, participantIndex) => {
  return (dispatch, getState) => {
    const state = getState();
    const cart = getCart(state);

    const index = cart.items.findIndex(cartItem => cartItem.offerId === item.offerId);

    if (index === -1) {
      // Add new item.
      item.options = {
        participants: [participantIndex],
      };
      dispatch(addItem(item));
    } else {
      // Update existing item.
      const cartItem = cart.items[index];
      cartItem.quantity += 1;
      cartItem.options = {
        participants: [
          ...cartItem.options.participants,
          participantIndex,
        ],
      };
      dispatch(updateItem(index, cartItem));
    }
  };
};

export const removeAddOnsFromCart = (participantIndex) => {
  return async (dispatch, getState) => {
    const state = getState();
    const cart = getCart(state);

    // Iterate backwards since we're removing items by index.
    for (let itemIndex = cart.items.length - 1; itemIndex >= 0; itemIndex--) {
      const item = cart.items[itemIndex];

      // Make sure this is one of our add-ons.
      if (item.type !== 'add-on') continue;
      if (!item.options || !item.options.participants) continue;
      if (!item.options.participants.includes(participantIndex)) continue;

      if (item.quantity === 1) {
        // Remove item.
        dispatch(removeItem(itemIndex));
      } else {
        // Update item.
        item.quantity -= 1;
        item.options.participants = item.options.participants.filter(index => index !== participantIndex);
        dispatch(updateItem(item));
      }
    }
  };
};

export const addMerchToCart = (merch) => {
  return async (dispatch, getState) => {
    const state = getState();
    
    for (const [offerId, offerQty] of Object.entries(merch)) {
      const offer = getMerchOffer(state, offerId);

      // Offer with no products.
      if (typeof offerQty === 'number' && offerQty > 0) {
        dispatch(addItem({
          type:     'merchandise',
          offerId:  offerId,
          price:    offer.sell,
          quantity: offerQty,
        }));
      }

      // Offer with products.
      if (typeof offerQty === 'object') {
        for (const [productId, productQty] of Object.entries(offerQty)) {
          if (typeof productQty === 'number' && productQty > 0) {
            dispatch(addItem({
              type:      'merchandise',
              offerId:   offerId,
              productId: productId,
              price:     offer.sell,
              quantity:  productQty,
            }));
          }
        }
      }
    }
  };
};
