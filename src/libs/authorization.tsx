import * as React from 'react';

import { useAuth } from './auth';

export enum ROLES {
  ADMIN = 'ADMIN',
  DEVELOPER = 'DEVELOPER',
  USER = 'USER',
}

type RoleTypes = keyof typeof ROLES;

export const POLICIES = {
  // 'comment:delete': (user: Profile, comment: Comment) => { EXAMPLE
  //   if (user.role === 'ADMIN') {
  //     return true;
  //   }
  //   if (user.role === 'USER' && comment.authorId === user.id) {
  //     return true;
  //   }
  //   return false;
  // },
};

export const useAuthorization = () => {
  const { user } = useAuth();

  if (!user) {
    throw Error('User does not exist!');
  }

  const checkAccess = React.useCallback(
    ({ allowedRoles }: { allowedRoles: RoleTypes[] }) => {
      if (allowedRoles && allowedRoles.length > 0) {
        return allowedRoles?.includes(user.profile.role);
      }

      return true;
    },
    [user.profile.role],
  );

  return { checkAccess, role: user.profile.role };
};

type AuthorizationProps = {
  forbiddenFallback?: React.ReactNode;
  children: React.ReactNode;
} & (
  | {
      allowedRoles: RoleTypes[];
      policyCheck?: never;
    }
  | {
      allowedRoles?: never;
      policyCheck: boolean;
    }
);

export const Authorization = ({
  policyCheck,
  allowedRoles,
  forbiddenFallback = null,
  children,
}: AuthorizationProps) => {
  const { checkAccess } = useAuthorization();

  let canAccess = false;

  if (allowedRoles) {
    canAccess = checkAccess({ allowedRoles });
  }

  if (typeof policyCheck !== 'undefined') {
    canAccess = policyCheck;
  }

  return <>{canAccess ? children : forbiddenFallback}</>;
};
