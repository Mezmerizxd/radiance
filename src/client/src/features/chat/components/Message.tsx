export const Message = ({ message }: { message: Message }) => {
  return (
    <div className="my-2 p-2 w-full bg-background-dark space-y-2 rounded-md shadow-sm">
      <div className="flex items-first space-x-2">
        <h1 className="flex items-center justify-center text-lg font-bold">{message.profile.username}</h1>
        <p className="flex items-center justify-center text-sm">{message.createdAt.toLocaleDateString()}</p>
      </div>

      <div>
        <p className="text-normal">{message.message}</p>
      </div>
    </div>
  );
};
