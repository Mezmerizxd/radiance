import { useNavigate } from 'react-router-dom';

import { Layout } from '../components/Layout';
import { Button } from '../../../components/Elements';

export const Verify = () => {
  const navigate = useNavigate();

  // Get query from url
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
    <Layout title="Verify your account">
      <div className="min-w-max space-y-2">
        <h2 className="text-white-light">Click Verify to verify your account</h2>
        <p className="text-white-dark text-sm">code: {code ? code : 'Code not found!'}</p>
        <Button className="w-full" size="sm">
          Verify
        </Button>
      </div>
    </Layout>
  );
};
