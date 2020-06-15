import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Row, Col, Form } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { FormContext } from 'shared/utils';
import { Button } from 'form/components';
import { MerchItem, MerchQtysModal } from 'registration/components';
import { TextInput, PhoneInput, StateInput, CountryInput } from 'registration/components';


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
    "shortDescription": "Curae varius ultricies vulputate nostra commodo maecenas condimentum, neque orci gravida eros integer pulvinar sem vehicula, netus quam bibendum montes lobortis lorem. Imperdiet cursus rhoncus sagittis nisl aliquam, convallis phasellus velit donec per risus, hac at ligula libero.",
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
  },


  {
    "offerId": "55",
    "name": "2018 Event Hat",
    "shortDescription": "Placerat amet bibendum ad elit condimentum nibh porttitor tempor dictumst per, luctus nunc lacinia torquent quis ultricies proin eros ante auctor hendrerit, class cum cubilia tortor sed magnis aenean purus blandit.",
    "image": "https://placeimg.com/640/480/any",
    "sell": "15.00",
    "soldOut": false,
    "products": [],
  },


  {
    "offerId": "56",
    "name": "2018 Event Hat",
    "shortDescription": "Placerat amet bibendum ad elit condimentum nibh porttitor tempor dictumst per, luctus nunc lacinia torquent quis ultricies proin eros ante auctor hendrerit, class cum cubilia tortor sed magnis aenean purus blandit.",
    "image": "https://placeimg.com/640/480/any",
    "sell": "15.00",
    "soldOut": false,
    "products": [],
  }
];


export class MerchPanel extends BasePanel {
  constructor(props) {
    super(props);

    this.state = {
      formData: {},
      errors: [],
      onChange: this.onFormChange,

      selectedItem: null,
      qtys: {},
    };
  }

  onClickNext = async () => {
    // TODO: validate...

    this.props.nextPanel();
  };

  onClickEdit = () => {
    this.props.editPanel();
  };

  onFormChange = (field, value) => {
    this.setState(prevState => ({
      formData: { ...prevState.formData, [field]: value },
      errors: prevState.errors.filter(error => error.field !== field),
    }));
  }

  onSelectMerchItem = (merchItem) => {
    this.setState({ selectedItem: merchItem });
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
    this.setState({ selectedItem: null });
  };

  hasAddedMerch() {
    for (const [offerId, offerQty] of Object.entries(this.state.qtys)) {
      if (typeof offerQty === 'number' && offerQty > 0) {
        return true;
      }

      if (typeof offerQty === 'object') {
        for (const [productId, productQty] of Object.entries(offerQty)) {
          if (typeof productQty === 'number' && productQty > 0) {
            return true;
          }
        }
      }
    }

    return false;
  }

  reset() {
  }

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait" className="merch-panel">
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
    const { selectedItem, qtys } = this.state;

    return (
      <PanelContainer layout={layout} status="edit" className="merch-panel">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title="Check Out Our Official Merchandise"
        />

        <PanelBody layout={layout} status="edit" isBusy={isBusy}>

          <p>Hello merch panel!</p>

          <Row className="merch-items">
            {merchandise.map(item =>
              <Col key={item.offerId} xs={12} md={6} xl={4}>
                <MerchItem
                  key={item.offerId}
                  merchItem={item}
                  qtys={qtys[item.offerId]}
                  onShowQtys={this.onSelectMerchItem}
                  onChangeQty={this.onChangeQty}
                />
              </Col>
            )}
          </Row>

          {this.renderAddressFields()}

          <div className="panel-actions">
            <Button onClick={this.onClickNext} isBusy={isBusy}>
              <FormattedMessage id="btn.next" />
            </Button>
          </div>

        </PanelBody>

        <MerchQtysModal
          merchItem={selectedItem}
          qtys={selectedItem ? qtys[selectedItem.offerId] : null}
          onClickClose={this.onCloseQtysModal}
          onChangeQty={this.onChangeQty}
        />
      </PanelContainer>
    );
  }

  renderAddressFields() {
    if (!this.hasAddedMerch()) return null;

    const country = this.state.formData['delivery.country'];

    return (
      <FormContext.Provider value={this.state}>
        <div className="delivery-address">
          <h2>Delivery Details</h2>

          <Form.Row>
            <Col>
              <CountryInput field="delivery.country" label="Country" required />
            </Col>
          </Form.Row>

          <Form.Row>
            <Col>
              <TextInput field="delivery.address1" label="Address 1" required />
            </Col>
          </Form.Row>

          <Form.Row>
            <Col>
              <TextInput field="delivery.address2" label="Address 2" />
            </Col>
          </Form.Row>

          <Form.Row>
            <Col>
              <TextInput field="delivery.suburb" label="Suburb" required />
            </Col>
          </Form.Row>

          <Form.Row>
            <Col>
              <StateInput field="delivery.state" label={getStateLabel(country)} country={country} required />
            </Col>
            <Col>
              <TextInput field="delivery.postcode" label={getPostcodeLabel(country)} required />
            </Col>
          </Form.Row>
        </div>
      </FormContext.Provider>
    );
  }

  renderDone() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="done" className="merch-panel">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title="Merchandise"
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">

          {/* TODO: what content goes here?? */}
          <p>Check out our offical merchandise</p>

          <Button onClick={this.onClickEdit}>
            <FormattedMessage id="btn.edit" />
          </Button>
          
        </PanelBody>
      </PanelContainer>
    );
  }
}
