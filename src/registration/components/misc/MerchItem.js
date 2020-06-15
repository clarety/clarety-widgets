import React from 'react';
import { Image } from 'react-bootstrap';
import { Button } from 'form/components';
import { QtyInput } from 'registration/components';
import { Currency } from 'shared/components';

export const MerchItem = ({ merchItem, qtys, onShowQtys, onChangeQty }) => {
  const hasSizes = !!(merchItem.products && merchItem.products.length);

  return (
    <div className="merch-item">
      <Image src={merchItem.image} fluid className="merch-item__image" />
      <h3 className="merch-item__name">{merchItem.name}</h3>
      <h4 className="merch-item__price"><Currency amount={merchItem.sell} /></h4>
      <div className="merch-item__description">{merchItem.shortDescription}</div>

      {hasSizes
        ? <MerchItemSizes merchItem={merchItem} qtys={qtys} onShowQtys={onShowQtys} />
        : <QtyInput value={qtys} onChange={value => onChangeQty(merchItem.offerId, undefined, value)} />
      }
    </div>
  );
};

const MerchItemSizes = ({ merchItem, qtys, onShowQtys }) => (
  <div className="merch-item-sizes">
    {merchItem.products.map(product => {
      const qty = qtys && qtys[product.productId];
      if (!qty) return null;

      return (
        <div className="merch-item-size">
          <div className="merch-item-size__name">{product.name}</div>
          <div className="merch-item-size__qty">{qty}</div>
        </div>
      );
    })}

    <Button onClick={() => onShowQtys(merchItem)}>Select Sizes</Button>
  </div>
);
