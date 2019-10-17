export const getCart = (state) => state.cart;

export const getIsEmpty = (state) => {
  const cart = getCart(state);

  return !cart || !cart.items || !cart.items.length;
};
