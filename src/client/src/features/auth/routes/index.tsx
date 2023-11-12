import { Route, Routes } from 'react-router-dom';

import { Login } from './Login';
import { Register } from './Register';
import { ResetPassword } from './ResetPassword';
import { ForgotPassword } from './ForgotPassword';

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
};
