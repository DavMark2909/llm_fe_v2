import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import MessageInput from "./MessageInput";
import robotPic from '../assets/NovaMind.png';
import humanPic from '../assets/avatar.png';

import { Paperclip } from "lucide-react";

const ChatContainer = () => {

  const {messages, isMessagesLoading, getMessages, selectedChat, subscribeToMessages, unsubscribeFromMessages, convertFiles, isTableCreating } = useChatStore();
  const messageEndRef = useRef(null);
  const messageInputRef = useRef(null)

  useEffect(() => {
    getMessages(selectedChat.chat_id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();  
  }, [selectedChat.chat_id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput ref={messageInputRef}/>
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
            ref={messageEndRef}
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
                <>
                {message.content && <p>{message.content}</p>}
                {message.type === "file_upload_decision" && (
                  <div className="mt-2 flex gap-2">
                    <button
                      className="btn btn-xs btn-primary"
                      onClick={() => {
                        messageInputRef.current?.triggerFilePicker();
                      }}
                    >
                      Yes
                    </button>
                    <button
                      className="btn btn-xs btn-secondary"
                      onClick={() => {
                        convertFiles()
                      }}
                    >
                      No
                    </button>
                  </div>
                )}
                </>
              )}
            </div>
          </div>
        ))}
        {isTableCreating && (
          <div className="chat chat-start">
            <div className="chat-bubble bg-base-200">
              <span className="loading loading-spinner loading-md"></span>
            </div>
        </div>
        )}
      </div>

      <MessageInput ref={messageInputRef}/>
    </div>
  );
  
}

export default ChatContainer