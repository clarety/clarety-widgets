export const getCart = (state) => state.cart;

export const getIsEmpty = (state) => {
  const cart = getCart(state);

  return !cart || !cart.items || !cart.items.length;
};

export const getCartTotalItemsQty = (state) =>{
  const cart = getCart(state);
  let count = 0;
  if(cart && cart.items){
    for(let item of cart.items){
      count += item.quantity;
    }
  }
  return count;
};