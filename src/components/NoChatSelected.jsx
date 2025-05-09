import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useChatStore } from '../store/useChatStore';


const NoChatSelected = () => {

  const {createNewChat} = useChatStore()

  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              <MessageSquare className="w-8 h-8 text-primary " />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold">Welcome to NovaMind!</h2>
        <p className="text-base-content/60">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
      <div className="text-center">
        <p className="text-base-content/60">
          <button
          onClick={createNewChat}
          className="link link-primary"
          type="button"
          >
          Start new conversation
          </button>
      </p>
    </div>
    </div>
  );
};

export default NoChatSelected;