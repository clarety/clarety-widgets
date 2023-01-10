import { addItem } from 'shared/actions';

export const addMembershipToCart = (offer) => addItem({
  type:     offer.type,
  offerUid: offer.offerUid,
  price:    offer.amount,
});
