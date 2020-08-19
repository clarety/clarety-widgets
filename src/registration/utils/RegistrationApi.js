import { ClaretyApi } from 'clarety-utils';

export class RegistrationApi {
  static storeId = null;
  static seriesId = null;

  static init({ storeId, seriesId }) {
    this.storeId = storeId;
    this.seriesId = seriesId;
  }

  static setJwtCustomer(jwtCustomer) {
    ClaretyApi.setJwtCustomer(jwtCustomer);
  }

  // Events

  static async fetchEvents() {
    const params = { storeId: this.storeId, seriesId: this.seriesId };
    const results = await ClaretyApi.get('registration-series-events/', params);
    return results[0];
  }

  static async fetchEvent(eventId) {
    const params = { eventId, storeId: this.storeId, seriesId: this.seriesId };
    const results = await ClaretyApi.get('registration-full/', params);
    return results[0];
  }

  // Customer

  static async hasAccount(email) {
    const results = await ClaretyApi.get('customer-search/', { email });
    return results[0];
  }

  static async resetPassword(email) {
    const results = await ClaretyApi.post('customer-search/', { email, sendPassword: true });
    return results[0];
  }

  static async createAccount(data) {
    const results = await ClaretyApi.post('customer-new/', data);
    return results[0];
  }

  static async createGuestAccount(data) {
    const results = await ClaretyApi.post('registration-guest/', data);
    return results[0];
  }

  static async fetchCustomer(previousSeriesId) {
    const results = await ClaretyApi.get('registration-customer/', { previousSeriesId });
    return results[0];
  }

  static async updateCustomer(data) {
    const results = await ClaretyApi.post('registration-customer/', data);
    return results[0];
  }

  // Teams

  static async searchTeams(query) {
    const params = { query, storeId: this.storeId, seriesId: this.seriesId };
    const results = await ClaretyApi.get('registration-teams/', params);
    return results;
  }

  static async fetchTeam(teamId) {
    const params = { teamId, storeId: this.storeId, seriesId: this.seriesId };
    const results = await ClaretyApi.get('registration-teams/', params);
    return results[0];
  }

  static async createTeam(data) {
    const results = await ClaretyApi.post('registration-teams/', data, { storeId: this.storeId });
    return results[0];
  }

  static async checkTeamPassword(data) {
    const results = await ClaretyApi.post('registration-teams/', data, { storeId: this.storeId });
    return results[0];
  }

  static async checkPromoCode(promoCode) {
    const results = await ClaretyApi.get('registration-promocode/', { promoCode });
    return results[0];
  }

  // Registration

  static async createRegistration(data) {
    const results = await ClaretyApi.post('registration-sale/', data, { storeId: this.storeId });
    return results[0];
  }

  static async fetchSale(saleId) {
    const results = await ClaretyApi.get(`sale/${saleId}`, { storeId: this.storeId });
    return results[0];
  }

  static async updateShipping(saleId, shippingKey) {
    const data = { saleId, key: shippingKey };
    const results = await ClaretyApi.post('registration-shipping/', data, { storeId: this.storeId });
    return results[0];
  }

  static async submitRegistration(data) {
    const results = await ClaretyApi.post('registration-payment/', data, { storeId: this.storeId });
    return results[0];
  }
}
