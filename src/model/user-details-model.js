import { generateUserDetails } from '../mock/user-details';

export default class UserDetailsModel {
  #userDetails = generateUserDetails();

  get userDetails() {
    return this.#userDetails;
  }
}
