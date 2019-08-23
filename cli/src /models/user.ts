import deleteMe from '../graph/mutations/user-delete';
import updateMe from '../graph/mutations/user-update';
import { IUserData } from '../types/user';
import Amplify from '../utils/amplify';
import Model from './model';

interface IUser {
  userConfirmed: boolean;
  userSub: string;
}

class User extends Model {
  private username: string;
  private password: string;

  constructor(username: string, password: string) {
    super();
    this.username = username;
    this.password = password;
  }

  public async auth(): Promise<void> {
    return Amplify.Auth.signIn(this.username.toLowerCase(), this.password);
  }

  public async create(): Promise<IUser> {
    return Amplify.Auth.signUp({
      attributes: {
        email: this.username.toLowerCase(),
      },
      password: this.password,
      username: this.username.toLowerCase(),
      validationData: [{ Name: 'rawEmail', Value: this.username }],
    });
  }

  public async delete(): Promise<void> {
    return this.request(deleteMe);
  }

  public async update(UserData: IUserData): Promise<void> {
    return this.request(updateMe, {
      name: UserData.name,
      picture: {
        bucket: process.env.UPLOAD_BUCKET,
        key: `cli/${UserData.key}`,
        mimeType: 'image/jpeg',
        region: process.env.REGION,
      },
      profile: UserData.profile,
    });
  }

  public async verify(): Promise<void> {
    return Amplify.Auth.confirmSignUp(this.username, 'verification');
  }
}

export default User;
