import { generateUserDetails } from '../mock/user-details';

export default class UserDetailsModel {
  userDetails = generateUserDetails();

  getUserDetails = () => this.userDetails;
}
