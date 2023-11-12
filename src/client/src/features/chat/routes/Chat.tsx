import { ContentLayout } from '../../../components/Layout';
import { Layout } from '../components/Layout';
import { Message } from '../components/Message';
import { MessageBar } from '../components/MessageBar';

export const Chat = () => {
  return (
    <ContentLayout title="Chat">
      <div className="mt-4">
        <Layout>
          <div>
            <Message />
          </div>
          <MessageBar />
        </Layout>
      </div>
    </ContentLayout>
  );
};
