import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
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
    const { layout, isBusy, index, question, quizType } = this.props;

    return (
      <PanelContainer layout={layout} status="edit">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title={question.title}
        />
        
        <PanelBody layout={layout} status="edit" isBusy={isBusy}>

          {quizType === 'poll' && this.renderPollQuestion()}
          {quizType === 'quiz' && this.renderPollQuestion()}
          {quizType === 'image-poll' && this.renderImagePollQuestion()}

        </PanelBody>
      </PanelContainer>
    );
  }

  renderPollQuestion() {
    return (
      <div className="quiz-options">
        {this.props.question.options.map(option =>
          <TextOption key={option.value} option={option} onPress={this.onPressOption} />
        )}
      </div>
    );
  }

  renderImagePollQuestion() {
    return (
      <Row>
        {this.props.question.options.map(option =>
          <Col key={option.value}>
            <ThumbnailOption option={option} onPress={this.onPressOption} />
          </Col>
        )}
      </Row>
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

const TextOption = ({ option, onPress }) => (
  <Button onClick={() => onPress(option)} variant="quiz-option">
    {option.label}
  </Button>
);

const ThumbnailOption = ({ option, onPress }) => (
  <Card onClick={() => onPress(option)} style={{ cursor: 'pointer' }}>
    <Card.Img variant="top" src={option.image} />
    <Card.Body className="text-center">
      <Card.Title>{option.label}</Card.Title>
    </Card.Body>
  </Card>
);
