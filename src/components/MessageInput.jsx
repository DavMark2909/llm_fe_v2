import { useRef, useState } from "react";
import { useChatStore } from '../store/useChatStore';
import { Paperclip, Send, X } from "lucide-react";
import { axiosInstance } from "../lib/axios";

const MessageInput = () => {

  const [text, setText] = useState("");
  const [fileData, setFileData] = useState(null);
  const fileInputRef = useRef(null);

  const {sendMessage, sendFileMessage} = useChatStore();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFileData({
        preview: reader.result,
        file: file
      });
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (e) => {
    setFileData(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !fileData) return;

    try {

      if (fileData){
        await sendFileMessage(fileData);
      }
      else {
        await sendMessage(text.trim())
      }

      setText("");
      setFileData(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {fileData && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
          <img
            src="https://via.placeholder.com/80x80?text=FILE"
            // alt="File Type"
            className="w-12 h-12 object-cover rounded"
          />
            <span className="text-sm text-zinc-300">{fileData.file.name}</span>
            <button
              onClick={removeFile}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept=".db, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          {/* <input
            type="file"
            accept=".db, .xls, .xlsx"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          /> */}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${fileData ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !fileData}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  )
}

export default MessageInput