import React from 'react';
import { useParams } from 'react-router-dom';
import ChatRoom from './ChatRoom';
import ChatList from './ChatList';

const ChatPage = () => {
  const { userId } = useParams();

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-screen bg-gray-50">
      {userId ? (
        <ChatRoom receiverId={userId} />
      ) : (
        <ChatList />
      )}
    </div>
  );
};

export default ChatPage;
