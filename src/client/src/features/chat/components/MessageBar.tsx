import * as z from 'zod';
import { Form, InputField } from '../../../components/Form';
import { Button } from '../../../components/Elements';

const schema = z.object({
  message: z.string().min(1, 'Required'),
});

type MessageValues = {
  message: string;
};

export const MessageBar = () => {
  return (
    <div className="flex items-center justify-center h-12 w-full">
      <div className="flex items-center justify-center w-full h-full">
        <Form<MessageValues, typeof schema> className="h-full w-full" onSubmit={async (values) => {}} schema={schema}>
          {({ register, formState }) => (
            <InputField
              className="h-12 w-full border-none"
              type="text"
              error={formState.errors['message']}
              registration={register('message')}
            />
          )}
        </Form>
      </div>
      <div className="flex items-center justify-center h-full">
        <Button className="h-full" size="sm">
          Send
        </Button>
      </div>
    </div>
  );
};
