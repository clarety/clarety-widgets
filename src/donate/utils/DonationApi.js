import { ClaretyApi } from 'shared/utils/clarety-api';

export class DonationApi {
  static setAuth(jwt) {
    ClaretyApi.setAuth(jwt);
  }

  static setJwtCustomer(jwtCustomer) {
    ClaretyApi.setJwtCustomer(jwtCustomer);
  }

  static setJwtSession(jwtSession) {
    ClaretyApi.setJwtSession(jwtSession);
  }

  static async actionAuth(actionKey) {
    const results = await ClaretyApi.get('donations/action-auth/', { actionKey });
    return results[0];
  }

  static async fetchCustomer() {
    const results = await ClaretyApi.get('donations/customer/');
    return results[0];
  }

  static async fetchIncompleteDonation() {
    const results = await ClaretyApi.get('donations/incomplete/');
    return results[0];
  }

  static async createDonation(data) {
    const results = await ClaretyApi.post('donations/', data);
    return results[0];
  }

  static async createPaymentSession(saleJwt, gatewayAccount, gatewayPaymentMethod, currency) {
    const results = await ClaretyApi.post('donations/payment-sessions/', { saleJwt, gatewayAccount, gatewayPaymentMethod, currency });
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
