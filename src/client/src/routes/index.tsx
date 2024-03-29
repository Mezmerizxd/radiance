import { useRoutes } from 'react-router-dom';

import { Landing } from '../features/misc';
import { useAuth } from '../libs/auth';

import { protectedRoutes } from './protected';
import { publicRoutes } from './public';

export const AppRoutes = () => {
  const auth = useAuth();

  const commonRoutes = [{ path: '/', element: <Landing /> }];

  const routes = auth.user.profile ? protectedRoutes : [];
  const element = useRoutes([...commonRoutes, ...publicRoutes, ...routes]);

  return <>{element}</>;
};
