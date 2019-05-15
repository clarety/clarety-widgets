import React from 'react';
// import './StepIndicator.css';

const StepIndicator = ({ currentStep }) => {
  const styles = _getStyles(currentStep);

  return (
    <ol className="widget-step-indicator">
      <li className={styles.amount}><span>Amount</span></li>
      <li className={styles.details}><span>Details</span></li>
      <li className={styles.payment}><span>Payment</span></li>
    </ol>
  );
};

const _getStyles = currentStep => {
  switch (currentStep) {
    case 'amount': return {
      amount: 'current',
      details: '',
      payment: '',
    };

    case 'details': return {
      amount: 'visited',
      details: 'current',
      payment: '',
    };

    case 'payment': return {
      amount: 'visited',
      details: 'visited',
      payment: 'current',
    };

    default: return null;
  }
};

export default StepIndicator;
