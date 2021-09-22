import React from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { moveInArray } from 'shared/utils';
import { updateFormData } from 'form/actions';
import { getValidationError } from 'form/utils';
import { FieldError } from 'form/components';

class _RankingInput extends React.Component {
  constructor(props) {
    super(props);

    if (!props.value) {
      if (props.initialValue !== undefined) {
        // Use initial value.
        props.setInitialValue(props.initialValue);
      } else if (props.options) {
        // Use options as initial value.
        const value = props.options.map(option => option.value);
        props.setInitialValue(value);
      } else {
        // Use empty array as initial value.
        props.setInitialValue([]);
      }
    }
  }

  onDragEnd = (result) => {
    // Dropped outside.
    if (!result.destination) return;

    // Update order.
    const items = Array.from(this.props.value);
    moveInArray(items, result.source.index, result.destination.index);
    this.props.onChange(items);
  };

  getLabelForValue(value) {
    return this.props.options.find(option => option.value === value).label;
  }

  render() {
    const { value, error, hideErrors } = this.props;

    if (!value) return null;

    return (
      <React.Fragment>
        <div className="ranking-input">
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {value.map((val, index) => (
                    <Draggable key={val} draggableId={val} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          className="ranking-item"
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <span className="ranking-item__handle">
                            <FontAwesomeIcon icon={faGripVertical} />
                          </span>
                          <span className="ranking-item__index">
                            {index + 1}.
                          </span>
                          <span className="ranking-item__label">
                            {this.getLabelForValue(val)}
                          </span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {!hideErrors && <FieldError error={error} />}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    value: state.formData[ownProps.field] || '',
    error: getValidationError(ownProps.field, state.errors),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: value => dispatch(updateFormData(ownProps.field, value)),
    setInitialValue: value => dispatch(updateFormData(ownProps.field, value)),
  };
};

export const RankingInput = connect(mapStateToProps, mapDispatchToProps)(_RankingInput);
