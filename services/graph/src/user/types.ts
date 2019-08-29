export interface IUser {
  admin: string;
  avatar?: {
    bucket: string;
    key: string;
    region: string;
    mimeType: string;
  } | null;
  createdAt: string;
  email: string;
  entity: string;
  expiresAt?: number | null;
  id: string;
  key: string;
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
  scope: string;
  updatedAt: string;
}
