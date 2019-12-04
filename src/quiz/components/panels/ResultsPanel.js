import React from 'react';
import { Row, Col, Card, ProgressBar, Spinner } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';

export class ResultsPanel extends BasePanel {
  state = { mode: 'loading' };

  async onShowPanel() {
    const { resultsOnly, submitQuiz } = this.props;

    if (!resultsOnly) await submitQuiz();
    
    this.setState({ mode: 'results' });
  }

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait" className="results-panel">
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
    const { layout, isBusy, index } = this.props;
    const { mode } = this.state;

    return (
      <PanelContainer layout={layout} status="edit" className="results-panel">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title="Results"
        />
        
        <PanelBody layout={layout} status="edit" isBusy={isBusy}>

          {mode === 'loading' && this.renderLoading()}
          {mode === 'results' && this.renderResults()}

        </PanelBody>
      </PanelContainer>
    );
  }

  renderLoading() {
    return (
      <div className="results-loading">
        <Spinner animation="border" />
      </div>
    );
  }

  renderResults() {
    const { quizType } = this.props;

    if (quizType === 'quiz')       return this.renderQuizResults();
    if (quizType === 'poll')       return this.renderPollResults();
    if (quizType === 'image-poll') return this.renderImagePollResults();

    throw new Error(`quiz type: '${quizType}' not handled`);
  }

  renderQuizResults() {
    return this.props.questions.map((question, index) =>
      <div key={index}>
        <h4>{question.title}</h4>

        <div className="poll-results">
          {question.options.map((option, index) =>
            <PollResult key={index} question={question} option={option} />
          )}
        </div>
      </div>
    );
  }

  renderPollResults() {
    return this.props.questions.map((question, index) =>
      <div key={index}>
        <h4>{question.title}</h4>

        <div className="poll-results">
          {question.options.map((option, index) =>
            <PollResult key={index} question={question} option={option} />
          )}
        </div>
      </div>
    );
  }

  renderImagePollResults() {
    return this.props.questions.map((question, index) =>
      <div key={index}>
        <h4>{question.title}</h4>

        <Row>
          {question.options.map((option, index) =>
            <Col key={index} xs={12} sm={6} md={4} xl={3}>
              <ImagePollResult question={question} option={option} />
            </Col>
          )}
        </Row>
      </div>
    );
  }

  renderDone() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="done" className="results-panel">
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

const PollResult = ({ option, question }) => {
  const percentage = (option.votes / question.totalVotes * 100).toFixed(0) + '%';

  return (
    <div className="poll-result">
      <div className="progress">
        <div className="progress-bar" style={{ width: percentage }}></div>
        <span className="progress-percentage">{percentage}</span>
        <span className="progress-label">{option.label}</span>
      </div>
    </div>
  );
}

const ImagePollResult = ({ option, question }) => {
  const percentage = (option.votes / question.totalVotes * 100).toFixed(0);

  return (
    <Card className="image-poll-result">
      <Card.Img variant="top" src={option.image} />
      <Card.Body className="text-center">
        <ProgressBar now={percentage} label={<b>{percentage}%</b>} />
      </Card.Body>
    </Card>
  );
}
