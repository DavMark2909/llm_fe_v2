import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import MessageInput from "./MessageInput";
import robotPic from '../assets/NovaMind.png';
import humanPic from '../assets/avatar.png';

import { Paperclip } from "lucide-react";

const ChatContainer = () => {

  const {messages, isMessagesLoading, getMessages, selectedChat} = useChatStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedChat.chat_id)
  }, [selectedChat.chat_id, getMessages])

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat ${message.human === true ? "chat-end" : "chat-start"}`}
            // ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.human === true
                      ? humanPic
                      : robotPic
                  }
                  alt="Pic"
                />
              </div>
            </div>
            
            <div className="chat-bubble flex flex-col">
              {message.file ? (
                <div className="flex items-center gap-2">
                  <Paperclip className="size-5" />
                  {message.content && <p>{message.content}</p>}
                </div>
              ) : (
                message.content && <p>{message.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
  
}

export default ChatContainer