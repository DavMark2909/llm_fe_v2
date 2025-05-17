import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import MessageInput from "./MessageInput";
import robotPic from '../assets/NovaMind.png';
import humanPic from '../assets/avatar.png';

import { Paperclip } from "lucide-react";

const timeChecker = (field) => {
  if (field.includes("time") || field.includes("data") || field.includes("day")) 
    return true
  else
  return false
}

const ChatContainer = () => {

  const {messages, generateStarSchema, addAcknoledgmentMessage, isMessagesLoading, getMessages, selectedChat, subscribeToMessages, unsubscribeFromMessages, convertFiles, isTableCreating, itemSelection, sendForFactTable } = useChatStore();
  const messageEndRef = useRef(null);
  const messageInputRef = useRef(null)

  const operations = ["MAX", "MIN", "COUNT", "AVG"]
  const time = ["HOUR", "WEEKDAY", "WEEK", "MONTH", "QUARTER"]

  const [selectedTime, setSelectedTime] = useState("")
  const [selectedTimeColumn, setSelectedTimeColumn] = useState("")

  const [selectedColumn, setSelectedColumn] = useState()
  const [settingTime, setSettingTime] = useState(false)

  const [selectedTable, setSelectedTable] = useState(null); 
  const [selectedColumns, setSelectedColumns] = useState([]);

  const [proceedTillFunction, setProceedTillFunction] = useState(false)
  const [operationScreen, setOperationScreen] = useState(false)
  const [selectedOperations, setSelectedOperations] = useState({})


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
                {message.type === "star_schema" && (
                  <div className="mt-2 flex gap-2">
                    <button
                      className="btn btn-xs btn-primary"
                      onClick={() => {
                        generateStarSchema()
                      }}
                    >
                      Yes
                    </button>
                    <button
                      className="btn btn-xs btn-secondary"
                      onClick={() => {
                        addAcknoledgmentMessage("star_schema")
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

        {itemSelection && (
          <div className="mt-2 flex flex-col gap-4">
            <p className="font-semibold">{proceedTillFunction ? "Select column for the operation" : "Select columns for the aggregation:"}</p>
            {operationScreen ? (
              <div className="flex flex-wrap gap-2">
                {!timeChecker(selectedColumn)
                  ? operations.map((operation) => (
                      <button
                        key={operation}
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          setSelectedOperations((prev) => ({
                            ...prev,
                            [selectedColumn]: operation 
                          }));
                          setOperationScreen(false);
                        }
                        }
                      >
                        {operation}
                      </button>
                    ))
                  : time.map((time_) => (
                      <button
                        key={time_}
                        className="btn btn-outline btn-sm"
                        onClick={settingTime ? (() => {
                          setSelectedTime(time_)
                          setSelectedTimeColumn(selectedColumn)
                          setSelectedColumn(null)
                          setSettingTime(false);
                          setOperationScreen(false);
                        }) : (() => {
                          setSelectedOperations((prev) => ({
                            ...prev,
                            [selectedColumn]: time_, 
                          }));
                          setOperationScreen(false);
                        })
                        }
                      >
                        {time_}
                      </button>
                    ))}
              </div>
            ) :

            !selectedTable ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.keys(itemSelection).map((table) => (
                    <button
                      key={table}
                      className="btn btn-outline btn-sm"
                      onClick={() => setSelectedTable(table)}
                    >
                      {table}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="font-semibold">Selected table: {selectedTable}</p>
                <p className="text-sm">Choose columns:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {itemSelection[selectedTable].map((column) => {
                    const isSelected = selectedColumns.includes(column);
                    return (
                      <button
                        key={column}
                        className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-outline"}`}
                        onClick={!proceedTillFunction ? (() =>
                          {setSelectedColumns((prev) => isSelected ? prev.filter((col) => col !== column) : [...prev, column]);
                            if (timeChecker(column)){
                              setSettingTime(true)
                              setSelectedColumn(column)
                              setOperationScreen(true)
                            }
                          }
                          
                        ) : (() => {
                            setSelectedColumn(column)
                            setOperationScreen(true);
                          })}
                        >
                          {column}
                        </button>
                    )
                    }) 
                  }
                </div>
              </>
            )}

            <div className="flex gap-2 justify-end">
              <button className="btn btn-sm btn-error"
                onClick={selectedTable ? (() => {setSelectedTable(null)}) : (() => {itemSelection = null})}
              >
                Cancel
              </button>
              <button className="btn btn-sm btn-success" onClick={selectedTable ? (() => {setSelectedTable(null)}) : (proceedTillFunction ? 
                (() => {sendForFactTable(selectedColumns, selectedOperations, selectedTimeColumn, selectedTime)}) 
                : (() => {
                    setSelectedTable(null)
                    setProceedTillFunction(true)
                  }))}
                disabled={selectedColumns.length === 0 && selectedTable}
              >
                Proceed
              </button>
            </div>
          </div>
        )}
      </div>

      <MessageInput ref={messageInputRef}/>
    </div>
  );
  
}

export default ChatContainer