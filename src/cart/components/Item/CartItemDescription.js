import React from 'react';

export const CartItemDescription = ({ item }) => {
    if (!item) return null;

    return (
        <p className="item__description">{item.description}</p>
    );
};
