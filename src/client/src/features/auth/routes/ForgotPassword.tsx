import { useNavigate } from 'react-router-dom';

import { Layout } from '../components/Layout';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';

export const ForgotPassword = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Forgot password">
      <div className="w-full space-y-2">
        <h2 className="text-white-light">Forgot Password</h2>
        <ForgotPasswordForm onSuccess={() => navigate('/app')} />
      </div>
    </Layout>
  );
};
