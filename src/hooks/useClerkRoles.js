import { useUser } from '@clerk/clerk-react';

export function useClerkRoles() {
  const { user } = useUser();
  const roles = user?.publicMetadata?.roles;
  return roles ? (Array.isArray(roles) ? roles : [roles]) : [];
}