import React from 'react';
import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';

export class QuestionPanel extends BasePanel {
  onPressOption = (option) => {
    const { question, updateFormData, nextPanel } = this.props;

    updateFormData(`answers.${question.id}`, option.value);
    nextPanel();
  };

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title=""
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, isBusy, index, question } = this.props;

    return (
      <PanelContainer layout={layout} status="edit">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title={question.title}
        />
        
        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
          <Form>
            <Row>
            {question.options.map(option =>
              <Col key={option.value}>
                <ThumbnailOption option={option} onPress={this.onPressOption} />
              </Col>
            )}
            </Row>
          </Form>
        </PanelBody>
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
          title=""
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">
        </PanelBody>
      </PanelContainer>
    );
  }
}

const ThumbnailOption = ({ option, onPress }) => (
  <Card onClick={() => onPress(option)} style={{ cursor: 'pointer' }}>
    <Card.Img variant="top" src={option.image} />
    <Card.Body className="text-center">
      <Card.Title>{option.label}</Card.Title>
    </Card.Body>
  </Card>
);
