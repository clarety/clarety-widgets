import React from 'react';
import { recurrenceStatusClassName } from 'update-payment-details/utils';

export function DonationList({ recurringDonations }) {
  return (
    <div className="donation-list">
      {recurringDonations.map((recurringDonation) =>
        <div key={recurringDonation.salelinePaymentUid} className="donation-list-item">
          <div className={recurrenceStatusClassName(recurringDonation.status)}>
            {recurringDonation.status}
          </div>
          <div className="details">
            {recurringDonation.amount} {recurringDonation.paymentSchedule}
          </div>
        </div>
      )}
    </div>
  );
}
