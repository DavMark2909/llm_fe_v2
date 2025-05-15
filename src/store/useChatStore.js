import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    chats: [],
    selectedChat: null,
    isChatsLoading: false,
    isMessagesLoading: false,

    isTableCreating: false,

    getChats: async () => {
        set({isChatsLoading: true})
        try {
              const res = await axiosInstance.get('/message/load-chats');
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

    sendMessage: async (messageText) => {
      const { selectedChat, messages } = get();
      try {
        const res = await axiosInstance.post(`/message/send/${selectedChat.chat_id}`, {
          content: messageText
        });
        set({ messages: [...messages, res.data] });
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },

    convertFiles: async () => {
      set({isTableCreating: true})
      const {messages} = get();
      try{
        if (res.status === 200) {
          set({messages: [...messages, res.data,
              {
                id: `temp-${Date.now()}`,
                human: false,
                type: "star_schema",
                content: "Would you like to generate a star schema?",
              }
            ]
          });
        } else {
          set({ messages: [...messages, res.data] });
        }
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({isTableCreating: false})
      }
    },

    sendFileMessage: async (fileData) => {
      const {selectedChat, messages} = get();
      try {
        const formData = new FormData();
        formData.append('file', fileData.file);
        formData.append('chat_id', selectedChat.chat_id);
        formData.append('extension', fileData.extension)

        const res = await axiosInstance.post('/message/send-file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        set({messages: [...messages, res.data, {
          id: `temp-${Date.now()}`,
          human: false,
          type: "file_upload_decision",
          content: "Do you want to upload another file?",
        }]});
      } catch(error){
        toast.error(error.response?.data?.message || "Failed to send the file");
      }
    },

    setSelectedChat: (selectedChat) => set({ selectedChat }),

    createNewChat: async () => {
      set({isChatsLoading: true, isMessagesLoading: true})
      try {
        const res = await axiosInstance.post('/message/chat/create');
        get().setSelectedChat(res.data);
        set(state => ({ chats: [...state.chats, res.data] }));
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({isChatsLoading: false, isMessagesLoading: false});
      }
    },

    subscribeToMessages: () => {
      const socket = useAuthStore.getState().socket;
      socket.on("newMessage", (newMessage) => {
        console.log(newMessage)
        set(state => ({messages: [...state.messages, newMessage]}));
      });
    },

    unsubscribeFromMessages: () => {
      const socket = useAuthStore.getState().socket;
      socket.off("newMessages")
    },
}))