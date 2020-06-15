import React from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from 'form/components';
import { QtyInput } from 'registration/components';

export const MerchQtysModal = ({ merchItem, qtys, onClickClose, onChangeQty }) => {
  if (!merchItem) return null;

  return (
    <Modal centered show={!!merchItem} onHide={onClickClose} className="clarety-widgets-modal">
      <Modal.Header>
        <Modal.Title>{merchItem.name}</Modal.Title>
      </Modal.Header>
        
      <div className="merch-qtys">
        {merchItem && merchItem.products.map(product => (
          <div key={product.productId} className="merch-qty">
            <span>{product.name}</span>

            <QtyInput
              value={qtys ? qtys[product.productId] : 0}
              onChange={value => onChangeQty(merchItem.offerId, product.productId, value)}
            />
          </div>
        ))}
      </div>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClickClose}>Done</Button>
      </Modal.Footer>
    </Modal>
  );
}
