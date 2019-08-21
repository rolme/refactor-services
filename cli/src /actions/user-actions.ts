import chalk from 'chalk';
import { image, internet } from 'faker';
import File from '../models/file';
import User from '../models/user';
import { IUserData, UserData } from '../types/user';
import Amplify from '../utils/amplify';
import { client } from '../utils/client';

class UserActions {
  private userID: string;
  private username: string;
  private password: string;

  constructor(
    username: string = internet.email(),
    password: string = 'refactor123',
  ) {
    this.userID = '';
    this.username = username;
    this.password = password;
  }

  // create users account and seeds it with contact metadata
  public async create(): Promise<void> {
    console.log(chalk.cyan('==>') + ` Creating User: ${this.username}`);

    // create user
    const user = await this.userCreate();

    if (!user.userConfirmed) {
      // verify user
      await this.userVerify();
    }

    // auth user
    await this.userAuth();

    // Upload avatar and save S3 key
    // const fileResponse = await this.userUpload();
    // UserData.key = fileResponse.key;

    // update user metadata
    // await this.userUpdate(UserData);
  }

  public async list(): Promise<void> {
    console.log(chalk.cyan('==>') + ` List of users`);
  }

  // authenticates user account
  public async userAuth(): Promise<void> {
    const user = new User(this.username, this.password);

    // Auth user
    await user.auth().catch((error) => {
      throw new Error(error.message);
    });

    //  Set access token
    const session = await Amplify.Auth.currentSession();
    client.setHeader('Authorization', session.getAccessToken().getJwtToken());

    console.log(chalk.green(`[${this.userID}]`) + ` Authenticated user`);
  }

  // creates user account
  private async userCreate(): Promise<{ userConfirmed: boolean }> {
    const user = new User(this.username, this.password);
    const userResponse = await user.create().catch((error) => {
      console.log(error);
    });

    if (userResponse !== undefined) {
      this.userID = userResponse.userSub;
      console.log(chalk.green(`[${this.userID}]`) + ` Created user`);
      return userResponse;
    }
    return Promise.reject();
  }

  // updates user attributes such as name and phone etc
  private async userUpdate(userData: IUserData): Promise<void> {
    const user = new User(this.username, this.password);
    await user.update(userData).catch((error) => {
      throw new Error(error.message);
    });
    console.log(chalk.green(`[${this.userID}]`) + ` Updated user details`);
  }

  // upload agent avatar
  private async userUpload(): Promise<{ key: string }> {
    const file = new File();

    // get random avatar image url from faker
    const avatarURL = image.avatar();

    console.log(chalk.green(`[${this.userID}]`) + ` Uploading avatar image...`);

    // Upload image
    const fileResponse = await file.upload(avatarURL).catch((error) => {
      throw new Error(error.message);
    });

    console.log(
      chalk.green(`[${this.userID}]`) + ` Uploaded user avatar image`,
    );

    return { key: fileResponse.key };
  }

  // verifies user account
  private async userVerify(): Promise<void> {
    const user = new User(this.username, this.password);
    await user.verify().catch((error) => {
      throw new Error(error.message);
    });
    console.log(chalk.green(`[${this.userID}]`) + ` Verified user`);
  }
}

export default UserActions;
