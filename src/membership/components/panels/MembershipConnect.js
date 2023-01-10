import { getSetting } from 'shared/selectors';
import { removeItemsWithType } from 'shared/actions';
import { getErrors } from 'form/selectors';
import { setErrors } from 'form/actions';
import { addMembershipToCart } from 'membership/actions';

export class MembershipConnect {
  static mapStateToProps = (state) => {
    return {
      membershipOffers: getSetting(state, 'membershipOffers'),
      errors: getErrors(state),
    };
  };

  static actions = {
    onSubmit: addMembershipToCart,
    removeAllMembershipsFromCart: () => removeItemsWithType('membership'),
    setErrors: setErrors,
  };
}
