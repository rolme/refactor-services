
export interface IUser {
  id: string;
  email: string;
  name?: string | null;
  picture?: {
    bucket: string;
    key: string;
    region: string;
    mimeType: string;
  } | null;
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
  expiresAt?: number | null;
  createdAt: string;
  updatedAt: string;
  welcomeEmailPending?: string | null;
}
