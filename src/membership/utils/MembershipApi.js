import { ClaretyApi } from 'clarety-utils';

export class MembershipApi {
  static setJwtCustomer(jwtCustomer) {
    ClaretyApi.setJwtCustomer(jwtCustomer);
  }

  static async createMembership(data) {
    const results = await ClaretyApi.post('membership/', data);
    return results[0];
  }

  static async fetchPaymentMethods(storeUid, membershipOfferId, membershipCategoryUid) {
    const params = {
      storeUid: storeUid,
      offerSingle: membershipOfferId,
      categoryUid: membershipCategoryUid,
    };

    const results = await ClaretyApi.get('widgets/membership/', params);
    return results[0];
  }
}
