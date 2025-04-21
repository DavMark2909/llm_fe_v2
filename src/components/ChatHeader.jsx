import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedChat, setSelectedChat } = useChatStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          <div>
            <h3 className="font-medium">{selectedChat.name}</h3>
            
          </div>
        </div>

        <button onClick={() => setSelectedChat(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;