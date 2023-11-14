import { ContentLayout } from '../../../components/Layout';
import { useAuth } from '../../../libs/auth';
import { Layout } from '../components/Layout';
import { Message } from '../components/Message';
import { MessageBar } from '../components/MessageBar';

export const Chat = () => {
  const { user } = useAuth();

  const messages: Message[] = [
    {
      id: '00001',
      message: 'Hello World',
      profile: user.profile,
      createdAt: new Date(),
    },
    {
      id: '00001',
      message: 'Hello World',
      profile: user.profile,
      createdAt: new Date(),
    },
    {
      id: '00001',
      message: 'Hello World',
      profile: user.profile,
      createdAt: new Date(),
    },
    {
      id: '00001',
      message: 'Hello World',
      profile: user.profile,
      createdAt: new Date(),
    },
    {
      id: '00001',
      message: 'Hello World',
      profile: user.profile,
      createdAt: new Date(),
    },
    {
      id: '00001',
      message: 'Hello World',
      profile: user.profile,
      createdAt: new Date(),
    },
    {
      id: '00001',
      message: 'Hello World',
      profile: user.profile,
      createdAt: new Date(),
    },
    {
      id: '00001',
      message: 'Hello World',
      profile: user.profile,
      createdAt: new Date(),
    },
    {
      id: '00001',
      message: 'Hello World',
      profile: user.profile,
      createdAt: new Date(),
    },
    {
      id: '00001',
      message: 'Hello World',
      profile: user.profile,
      createdAt: new Date(),
    },
    {
      id: '00001',
      message: 'Hello World',
      profile: user.profile,
      createdAt: new Date(),
    },
    {
      id: '00001',
      message: 'Hello World',
      profile: user.profile,
      createdAt: new Date(),
    },
    {
      id: '00001',
      message: 'Hello World',
      profile: user.profile,
      createdAt: new Date(),
    },
  ];
  return (
    <ContentLayout title="Chat">
      <div className="mt-4 h-screen" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        <div className="p-2 h-full overflow-scroll">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </div>
        <MessageBar />
      </div>
    </ContentLayout>
  );
};
