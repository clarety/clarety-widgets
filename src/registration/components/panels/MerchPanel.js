import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Row, Col, Modal } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { Button } from 'form/components';
import { QtyInput } from 'registration/components';


const merchandise = [
  {
    "offerId": "52",
    "name": "A really great t-shirt",
    "shortDescription": "Imperdiet cursus rhoncus sagittis nisl aliquam, convallis phasellus velit donec per risus, hac at ligula libero.",
    "image": "https://placeimg.com/640/480/any",
    "sell": "29.99",
    "soldOut": false,
    "products": [
      {
        "productId": "1",
        "name": "XX Small"
      },
      {
        "productId": "2",
        "name": "X Small"
      },
      {
        "productId": "3",
        "name": "Small"
      },
      {
        "productId": "4",
        "name": "Medium"
      },
      {
        "productId": "5",
        "name": "X Medium"
      },
      {
        "productId": "6",
        "name": "XX Medium"
      },
      {
        "productId": "7",
        "name": "Large"
      },
      {
        "productId": "8",
        "name": "X Large"
      },
      {
        "productId": "9",
        "name": "XX Large"
      },
    ]
  },


  {
    "offerId": "53",
    "name": "2018 Event t-shirt",
    "shortDescription": "Imperdiet cursus rhoncus sagittis nisl aliquam, convallis phasellus velit donec per risus, hac at ligula libero.",
    "image": "https://placeimg.com/640/480/any",
    "sell": "29.99",
    "soldOut": false,
    "products": [
      {
        "productId": "5",
        "name": "Small"
      },
      {
        "productId": "7",
        "name": "Medium"
      },
      {
        "productId": "9",
        "name": "Large"
      }
    ]
  },

  {
    "offerId": "54",
    "name": "2018 Event Hat",
    "shortDescription": "Placerat amet bibendum ad elit condimentum nibh porttitor tempor dictumst per, luctus nunc lacinia torquent quis ultricies proin eros ante auctor hendrerit, class cum cubilia tortor sed magnis aenean purus blandit.",
    "image": "https://placeimg.com/640/480/any",
    "sell": "15.00",
    "soldOut": false,
    "products": [],
  }
];


export class MerchPanel extends BasePanel {
  state = {
    selectedMerchItem: null,
    qtys: {},
  };

  onClickNext = async () => {
    // TODO: validate...

    this.props.nextPanel();
  };

  onClickEdit = () => {
    this.props.editPanel();
  };

  onSelectMerchItem = (merchItem) => {
    this.setState({ selectedMerchItem: merchItem });
  };

  onChangeQty = (offerId, productId, value) => {
    this.setState(prevState => {
      const qty = productId
        ? { ...prevState.qtys[offerId], [productId]: value }
        : value;

      return {
        qtys: { ...prevState.qtys, [offerId]: qty }
      };
    });
  }

  onCloseQtysModal = () => {
    this.setState({ selectedMerchItem: null });
  };

  reset() {
  }

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title="Merchandise"
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }
  
  renderEdit() {
    const { layout, index, isBusy, settings } = this.props;
    const { selectedMerchItem, qtys } = this.state;

    return (
      <PanelContainer layout={layout} status="edit" className="event-panel">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title="Merchandise"
        />

        <PanelBody layout={layout} status="edit" isBusy={isBusy}>

          <p>Hello merch panel!</p>

          <Row className="merch-items">
            {merchandise.map(item =>
              <Col key={item.offerId}>
                <MerchItem
                  merchItem={item}
                  onShowQtys={this.onSelectMerchItem}
                  onChangeQty={this.onChangeQty}
                  qty={this.state.qtys[item.offerId]}
                />
              </Col>
            )}
          </Row>

          <div className="panel-actions">
            <Button onClick={this.onClickNext} isBusy={isBusy}>
              <FormattedMessage id="btn.next" />
            </Button>
          </div>

        </PanelBody>

        <MerchQtysModal
          merchItem={selectedMerchItem}
          qtys={selectedMerchItem ? qtys[selectedMerchItem.offerId] : null}
          onClickClose={this.onCloseQtysModal}
          onChangeQty={this.onChangeQty}
        />
      </PanelContainer>
    );
  }

  renderDone() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="done">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title="Merchandise"
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">

          {/* TODO: what content goes here?? */}
          <p>Check out our merchandise</p>

          <Button onClick={this.onClickEdit}>
            <FormattedMessage id="btn.edit" />
          </Button>
          
        </PanelBody>
      </PanelContainer>
    );
  }
}





const MerchItem = ({ merchItem, qty, onShowQtys, onChangeQty }) => {
  const hasSizes = merchItem.products && merchItem.products.length;

  return (
    <div className="merch-item">
      <div>{merchItem.name}</div>

      {hasSizes
        ? <Button onClick={() => onShowQtys(merchItem)}>Select Sizes</Button>
        : <QtyInput value={qty} onChange={value => onChangeQty(merchItem.offerId, undefined, value)} />
      }
    </div>
  );
};



const MerchQtysModal = ({ merchItem, qtys, onClickClose, onChangeQty }) => {
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
