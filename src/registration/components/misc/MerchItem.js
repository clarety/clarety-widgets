import React from 'react';
import { Row, Col, Modal } from 'react-bootstrap';
import { Button } from 'form/components';
import { QtyInput } from 'registration/components';

export const MerchItem = ({ merchItem, qtys, onShowQtys, onChangeQty }) => {
  const hasProducts = !!(merchItem.products && merchItem.products.length);

  if (hasProducts) {
    return <MultiMerchItem merchItem={merchItem} qtys={qtys} onShowQtys={onShowQtys} />;
  } else {
    return <BasicMerchItem merchItem={merchItem} qty={qtys} onChangeQty={onChangeQty} />;
  }
};

const BasicMerchItem = ({ merchItem, qty, onChangeQty }) => (
  <div className="merch-item">
    <div>{merchItem.name}</div>

    <QtyInput
      value={qty}
      onChange={value => onChangeQty(merchItem.offerId, undefined, value)}
    />
  </div>
);

const MultiMerchItem = ({ merchItem, qtys, onShowQtys }) => (
  <div className="merch-item">
    <div>{merchItem.name}</div>

    <div>
      {merchItem.products.map(product => {
        const qty = qtys && qtys[product.productId];

        return qty
          ? <div key={product.productId}>{product.name} &times; {qty}</div>
          : null;
      })}

      <Button onClick={() => onShowQtys(merchItem)}>Select Sizes</Button>
    </div>
  </div>
);
