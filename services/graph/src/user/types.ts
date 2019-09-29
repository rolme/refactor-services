import { IModel } from '../types';

export interface IUser extends IModel {
  avatar?: {
    bucket: string;
    key: string;
    region: string;
    mimeType: string;
  } | null;
  email: string;
  expiresAt?: number | null;
  name?: string | null;
  profile?: {
    address?: {
      country?: string | null;
      locality?: string | null;
      postalCode?: string | null;
      region?: string | null;
      street: string[];
    } | null;
    email?: string | null;
    entity?: string | null;
    localAgency?: string | null;
    phone?: string | null;
    title?: string | null;
    website?: string | null;
  } | null;
  role?: string | null;
  source?: string | null;
  status?: string | null;
  welcomeSentAt: string | null;
}
