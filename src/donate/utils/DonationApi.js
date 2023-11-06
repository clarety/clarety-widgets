import { ClaretyApi } from 'clarety-utils';

export class DonationApi {
  static setAuth(jwt) {
    ClaretyApi.setAuth(jwt);
  }

  static setJwtCustomer(jwtCustomer) {
    ClaretyApi.setJwtCustomer(jwtCustomer);
  }

  static async actionAuth(actionKey) {
    const results = await ClaretyApi.get(`donations/action-auth/`, { actionKey });
    return results[0];
  }

  static async fetchCustomer() {
    const results = await ClaretyApi.get('donations/customer/');
    return results[0];
  }

  static async createDonation(data) {
    const results = await ClaretyApi.post('donations/', data);
    return results[0];
  }

  static async fetchPaymentMethods(storeUid, singleOfferId, recurringOfferId) {
    const params = {
      storeUid: storeUid,
      offerSingle: singleOfferId,
      offerRecurring: recurringOfferId,
    };

    const results = await ClaretyApi.get('widgets/donations/', params);
    return results[0];
  }

  static async fetchStripePaymentIntent(storeUid, amount, currency) {
    const params = {
      storeUid: storeUid,
      amount: amount,
      currency: currency,
    };

    const results = await ClaretyApi.get('donations/stripe-payment-intent/', params);
    return results[0];
  }
}
