import React from 'react';
import { t } from 'shared/translations';
import { recurrenceStatusClassName } from 'update-payment-details/utils';

export function DonationList({ recurringDonations, displayStatusFn }) {
  return (
    <div className="donation-list">
      {recurringDonations.map((recurringDonation) =>
        <div key={recurringDonation.salelinePaymentUid} className="donation-list-item">
          <div className={recurrenceStatusClassName(recurringDonation.status)}>
            {displayStatusFn
              ? displayStatusFn(recurringDonation)
              : t(recurringDonation.status, recurringDonation.status)
            }
          </div>
          <div className="details">
            {recurringDonation.amount} {t(recurringDonation.paymentSchedule, recurringDonation.paymentSchedule)}
          </div>
        </div>
      )}
    </div>
  );
}
