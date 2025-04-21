import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
    messages: [],
    chats: [],
    selectedChat: null,
    isChatsLoading: false,
    isMessagesLoading: false,

    getChats: async () => {
        set({isChatsLoading: true})
        try {
              const res = await axiosInstance.get('/message/load-chats');
              console.log(res.data)
              set({ chats: res.data });
        } catch (error){
            toast.error(error.response.data.messages)
        } finally {
            set({isChatsLoading: false})
        }
    },

    getMessages: async (chatId) => {
        set({ isMessagesLoading: true });
        try {
          const res = await axiosInstance.get(`/message/chat/load/${chatId}`);
          set({ messages: res.data });
        throw new Error("Demo error in getting messages")
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isMessagesLoading: false });
        }
      },

    sendMessage: async (messageData) => {
      const {selectedChat, messages} = get()
      try {
        const res = axiosInstance.post(`/message/send/${selectedChat.chat_id}`, messageData);
        set({messages:[...messages, res.data]})
      } catch (error){
        toast.error(error.response.data.message);
      }
    },

    setSelectedChat: (selectedChat) => set({ selectedChat }),
}))