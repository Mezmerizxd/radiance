import { useNavigate } from 'react-router-dom';

import { Layout } from '../components/Layout';
import { Button } from '../../../components/Elements';
import { ResetPasswordForm } from '../components/ResetPasswordForm';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const code = query.get('code');

  if (!code) {
    return (
      <Layout title="Code Not Found">
        <div className="min-w-max space-y-2">
          <h2 className="text-white-light">Code not found!</h2>
          <Button className="w-full" size="sm" onClick={() => navigate('/auth/login')}>
            Login
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Reset your password">
      <div className="w-full space-y-2">
        <h2 className="text-white-light">Reset your password here</h2>
        <ResetPasswordForm code={code} onSuccess={() => navigate('/auth/login')} />
        <p className="text-white-dark text-sm overflow-hidden overflow-ellipsis line-clamp-6">
          code: {code ? code : 'Code not found!'}
        </p>
      </div>
    </Layout>
  );
};
