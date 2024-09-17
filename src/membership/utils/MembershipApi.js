import { ClaretyApi } from 'shared/utils/clarety-api';

export class MembershipApi {
  static setJwtCustomer(jwtCustomer) {
    ClaretyApi.setJwtCustomer(jwtCustomer);
  }

  static async createMembership(data) {
    const results = await ClaretyApi.post('membership/', data);
    return results[0];
  }

  static async fetchPaymentMethods(storeUid, singleOfferId, membershipCategoryUid) {
    const params = {
      storeUid: storeUid,
      offerSingle: singleOfferId,
      categoryUid: membershipCategoryUid,
    };

    const results = await ClaretyApi.get('widgets/membership/', params);
    return results[0];
  }

  static async actionAuth(actionKey) {
    const results = await ClaretyApi.get(`membership/action-auth/`, { actionKey });
    return results[0];
  }
}
