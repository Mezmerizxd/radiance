import { useNavigate } from 'react-router-dom';

import { Layout } from '../../../features/auth/components/Layout';
import { Button } from '../../../components/Elements';
import { useVerifyEmail } from '../api/verifyEmail';

export const Verify = () => {
  const navigate = useNavigate();
  const verifyEmailMutation = useVerifyEmail();

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

  if (verifyEmailMutation.isLoading) {
    return (
      <Layout title="Verifying your account">
        <div className="min-w-max space-y-2">
          <h2 className="text-white-light">Verifying your account</h2>
          <p className="text-white-dark text-sm">code: {code}</p>
        </div>
      </Layout>
    );
  }

  if (verifyEmailMutation.isSuccess) {
    return (
      <Layout title="Account verified">
        <div className="min-w-max space-y-2">
          <h2 className="text-white-light">Account verified</h2>
          <Button className="w-full" size="sm" onClick={() => navigate('/app')}>
            Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Verify your account">
      <div className="w-full space-y-2">
        <h2 className="text-white-light">Click Verify to verify your account</h2>
        <p className="text-white-dark text-sm overflow-hidden overflow-ellipsis line-clamp-6">
          code: {code ? code : 'Code not found!'}
        </p>
        <Button onClick={() => verifyEmailMutation.mutate({ code })} className="w-full" size="sm">
          Verify
        </Button>
      </div>
    </Layout>
  );
};
