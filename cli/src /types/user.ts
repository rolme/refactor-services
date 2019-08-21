import { address, internet, name, phone } from 'faker';

export interface IUserData {
  key?: string;
  profile: {
    address: {
      country: string;
      locality: string;
      postalCode: string;
      region: string;
      street: string[];
    };
    email: string;
    phone: string;
    title: string;
    website: string;
  };
  name: string;
}

export const UserData: IUserData = {
  name: `${name.firstName()} ${name.lastName()}`,
  profile: {
    address: {
      country: 'US',
      locality: address.city(),
      postalCode: address.zipCode(),
      region: address.state(),
      street: [address.streetAddress()],
    },
    email: internet.email(),
    phone: phone.phoneNumber(),
    title: name.jobTitle(),
    website: internet.url(),
  },
};
