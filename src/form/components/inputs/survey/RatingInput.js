import React from 'react';
import { connect } from 'react-redux';
import { range } from 'shared/utils';
import { updateFormData } from 'form/actions';
import { getValidationError } from 'form/utils';
import { FieldError } from 'form/components';

class _RatingInput extends React.Component {
  constructor(props) {
    super(props);

    if (!props.value && props.initialValue !== undefined) {
      props.setInitialValue(props.initialValue);
    }
  }

  render() {
    const { onChange, error, hideErrors } = this.props;
  
    return (
      <React.Fragment>
        <div className="rating-input">
          {range(0, 10).map(value =>
            <RatingButton
              key={value}
              value={value}
              onClick={() => onChange(`${value}`)} // convert value to string
              isSelected={`${value}` === this.props.value}
            />
          )}
        </div>

        {!hideErrors && <FieldError error={error} />}
      </React.Fragment>
    );
  }
}

const RatingButton = ({ value, onClick, isSelected }) => (
  <button
    onClick={onClick}
    className={`btn-rating ${isSelected ? 'btn-rating--selected' : ''}`}
    type="button"
  >
    {value}
  </button>
);

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

export const RatingInput = connect(mapStateToProps, mapDispatchToProps)(_RatingInput);
