import React from 'react';
import { Container, Row, Col, Card, ProgressBar, Spinner } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';

export class ResultsPanel extends BasePanel {
  state = { mode: 'loading' };

  async onShowPanel() {
    const { resultsOnly, submitQuiz } = this.props;

    if (resultsOnly) {
      this.setState({ mode: 'results' });  
    } else {
      const showResults = await submitQuiz();
      if (showResults) {
        this.setState({ mode: 'results' });
      }
    }
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
    if (this.state.mode === 'loading') return this.renderLoading();

    return this.renderResults();
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
    const { layout, isBusy, index, questions } = this.props;

    return (
      <PanelContainer layout={layout} status="edit" className="results-panel">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title={`You scored ${this.getScore()}/${questions.length}`}
        />
        
        <PanelBody layout={layout} status="edit" isBusy={isBusy}>

          {questions.map(question =>
            <div key={question.id} className="quiz-result">
              <h5 className="question">{question.title}</h5>
              <p className="selected"><strong>You selected:</strong> {this.getSelectedAnswer(question).label}</p>
              <p className="correct"><strong>Correct answer:</strong> {this.getCorrectAnswer(question).label}</p>
            </div>
          )}

        </PanelBody>
      </PanelContainer>
    );
  }

  getScore() {
    return this.props.questions.reduce((count, question) => {
      const selected = this.getSelectedAnswer(question);
      const correct = this.getCorrectAnswer(question);
      return selected === correct ? count + 1 : count;
    }, 0);
  }

  getSelectedAnswer(question) {
    const value = this.props.formData[`answers.${question.id}`];
    return question.options.find(option => option.value === value);
  }

  getCorrectAnswer(question) {
    return question.options.find(option => option.isCorrect);
  }

  getMaxVoteCount(question) {
    return question.options.reduce((maxVotes, option) => option.votes > maxVotes ? option.votes : maxVotes, 0);
  }

  renderPollResults() {
    const { layout, isBusy } = this.props;

    return (
      <PanelContainer layout={layout} status="edit" className="results-panel">        
        <PanelBody layout={layout} status="edit" isBusy={isBusy}>

          {this.props.questions.map(question =>
            <Container key={question.id}>
              <h4>{question.title}</h4>

              <Row>
                {question.options.map(option =>
                  <PollResult key={option.value} question={question} option={option} />
                )}
              </Row>
            </Container>
          )}

        </PanelBody>
      </PanelContainer>
    );
  }

  renderImagePollResults() {
    const { layout, isBusy, questions } = this.props;

    return (
      <PanelContainer layout={layout} status="edit" className="results-panel">        
        <PanelBody layout={layout} status="edit" isBusy={isBusy}>

          {questions.map(question => {
            const maxVoteCount = this.getMaxVoteCount(question);

            return (
              <Container key={question.id}>
                <h4>{question.title}</h4>

                <Row>
                  {question.options.map(option =>
                    <Col key={option.value} xs={12} sm={6} lg={4}>
                      <ImagePollResult question={question} option={option} isLeading={option.votes === maxVoteCount} />
                    </Col>
                  )}
                </Row>
              </Container>
            );
          })}

        </PanelBody>
      </PanelContainer>
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

const ImagePollResult = ({ option, question, isLeading }) => {
  const percentage = (option.votes / question.totalVotes * 100).toFixed(0);

  return (
    <div className="image-poll-result">
      <Card>
        <Card.Img variant="top" src={option.image} />
        <Card.Body className="text-center">
          <Card.Title>{option.label}</Card.Title>
        </Card.Body>
      </Card>
      <ProgressBar now={percentage} label={<b>{percentage}%</b>} />
    </div>
  );
}
