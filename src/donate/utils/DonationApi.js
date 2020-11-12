import { ClaretyApi } from 'clarety-utils';

export class DonationApi {
  static setJwtCustomer(jwtCustomer) {
    ClaretyApi.setJwtCustomer(jwtCustomer);
  }

  static async fetchCustomer() {
    const results = await ClaretyApi.get('donations/customer/');
    return results[0];
  }

  static async createDonation(data) {
    const results = await ClaretyApi.post('donations/', data);
    return results[0];
  }
}
