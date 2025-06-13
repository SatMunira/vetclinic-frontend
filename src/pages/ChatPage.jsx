import React from 'react';
import { useParams } from 'react-router-dom';
import ChatRoom from './ChatRoom';
import ChatList from './ChatList';

const ChatPage = () => {
  const { userId } = useParams();

  return (
    <div>
      {userId ? (
        <ChatRoom receiverId={userId} />
      ) : (
        <ChatList />
      )}
    </div>
  );
};

export default ChatPage;
