import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { MessageSquare } from "lucide-react";

const Sidebar = () => {
  const { getChats, chats, selectedChat, setSelectedChat, isChatsLoading } = useChatStore();

  useEffect(() => {
    getChats();
  }, [getChats]);


  if (isChatsLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-6" />
          <span className="font-medium hidden lg:block">Chats</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => setSelectedChat(chat)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedChat?.chat_id === chat.chat_id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <span>{chat.name}</span>
            </div>
          </button>
        ))}

        {chats.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No chats yet</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;