import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,

    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check") 
            set({authUser:res.data.name})
        } catch (error){
            console.log("Error in CheckingAuth: ", error)
            set({authUser:null})
        } finally {
            set({isCheckingAuth: false})
        }
    },

    signup: async (data) => {
        set({isSigningUp: true})
        try{
            const res = await axiosInstance.post("/auth/register", data)
            set({authUser: res.data.name})
            toast.success("Account created successfully!")
        } catch(error){
            toast.error(error.response.data)
        } finally{
            set({isSigningUp: false})
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data.name });
          toast.success("Logged in successfully");
    
        //   get().connectSocket();
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ authUser: null });
          toast.success("Logged out successfully");
        //   get().disconnectSocket();
        } catch (error) {
          toast.error(error.response.data);
        }
      },
}));